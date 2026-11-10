import { config } from '../config/env'
import { MovieIngestionService, SyncResult, SyncOptions } from './movieIngestion.service'
import { prisma } from '../config/prisma'

export interface SchedulerStatus {
  isRunning: boolean
  autoSyncEnabled: boolean
  intervalMinutes: number
  lastRunAt: string | null
  nextRunAt: string | null
  totalRuns: number
  lastResult: SyncResult | null
  sources: SyncOptions
}

export class MovieSyncScheduler {
  private static timer: NodeJS.Timeout | null = null
  private static isRunning = false
  private static isSyncRunning = false
  private static totalRuns = 0
  private static lastRunAt: Date | null = null
  private static nextRunAt: Date | null = null
  private static lastResult: SyncResult | null = null

  private static currentOptions: SyncOptions = {
    includeKKPhimNew: true,
    includeKKPhimTheatrical: true,
    includeKKPhimAnime: true,
    includeTMDBTheatrical: true,
    maxItemsPerSource: 24,
  }

  private static intervalMinutes = config.cinema.syncIntervalMinutes || 360
  private static autoSyncEnabled = config.cinema.autoSyncEnabled

  /**
   * Initializes and starts the background automated synchronization worker
   */
  public static async start(): Promise<void> {
    if (this.isRunning) return
    this.isRunning = true

    // Load persisted settings from database if available
    await this.loadPersistedSettings()

    // eslint-disable-next-line no-console
    console.log(
      `🤖 [MovieSyncScheduler]: Automated Movie Sync Scheduler initialized (Interval: ${this.intervalMinutes}m, Active: ${this.autoSyncEnabled})`
    )

    if (this.autoSyncEnabled) {
      // Schedule background execution
      this.scheduleNext()

      // Initial execution after 15 seconds to let server boot cleanly
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('[MovieSyncScheduler]: Running initial automatic movie discovery on startup...')
        this.executeSync('server_startup_scheduler').catch((err) => {
          // eslint-disable-next-line no-console
          console.error('[MovieSyncScheduler]: Initial startup sync error:', err)
        })
      }, 15000)
    }
  }

  /**
   * Loads settings from SystemSetting table
   */
  private static async loadPersistedSettings(): Promise<void> {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'movie_sync_config' },
      })
      if (setting && setting.value && typeof setting.value === 'object') {
        const val = setting.value as any
        if (typeof val.autoSyncEnabled === 'boolean') this.autoSyncEnabled = val.autoSyncEnabled
        if (typeof val.intervalMinutes === 'number' && val.intervalMinutes > 0)
          this.intervalMinutes = val.intervalMinutes
        if (val.sources && typeof val.sources === 'object') {
          this.currentOptions = { ...this.currentOptions, ...val.sources }
        }
      }
    } catch {
      // In-memory or fallback mode
    }
  }

  /**
   * Saves updated settings into SystemSetting table
   */
  public static async updateSettings(newSettings: {
    autoSyncEnabled?: boolean
    intervalMinutes?: number
    sources?: Partial<SyncOptions>
  }): Promise<SchedulerStatus> {
    if (typeof newSettings.autoSyncEnabled === 'boolean') {
      this.autoSyncEnabled = newSettings.autoSyncEnabled
    }
    if (typeof newSettings.intervalMinutes === 'number' && newSettings.intervalMinutes >= 15) {
      this.intervalMinutes = newSettings.intervalMinutes
    }
    if (newSettings.sources) {
      this.currentOptions = { ...this.currentOptions, ...newSettings.sources }
    }

    try {
      await prisma.systemSetting.upsert({
        where: { key: 'movie_sync_config' },
        update: {
          value: {
            autoSyncEnabled: this.autoSyncEnabled,
            intervalMinutes: this.intervalMinutes,
            sources: this.currentOptions as any,
            updatedAt: new Date().toISOString(),
          },
        },
        create: {
          key: 'movie_sync_config',
          value: {
            autoSyncEnabled: this.autoSyncEnabled,
            intervalMinutes: this.intervalMinutes,
            sources: this.currentOptions as any,
            updatedAt: new Date().toISOString(),
          },
        },
      })
    } catch {
      // Ignore DB write error in offline mode
    }

    // Reschedule background timer
    this.reschedule()
    return this.getStatus()
  }

  /**
   * Schedules the next run with safe interval handling
   */
  private static scheduleNext(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    if (!this.autoSyncEnabled) {
      this.nextRunAt = null
      return
    }

    const intervalMs = this.intervalMinutes * 60 * 1000
    this.nextRunAt = new Date(Date.now() + intervalMs)

    this.timer = setInterval(() => {
      this.executeSync('scheduled_cron').catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[MovieSyncScheduler]: Error during scheduled sync:', err)
      })
      this.nextRunAt = new Date(Date.now() + intervalMs)
    }, intervalMs)
  }

  /**
   * Re-schedules the background worker with current interval
   */
  public static reschedule(): void {
    this.scheduleNext()
  }

  /**
   * Core executor for movie sync runs with Mutex Guard
   */
  public static async executeSync(triggeredBy = 'scheduled_cron'): Promise<SyncResult> {
    if (this.isSyncRunning) {
      throw new Error('Tiến trình đồng bộ phim tự động đang chạy. Vui lòng chờ...')
    }

    this.isSyncRunning = true
    try {
      // eslint-disable-next-line no-console
      console.log(`🎬 [MovieSyncScheduler]: Executing automated movie sync (Triggered by: ${triggeredBy})...`)

      const result = await MovieIngestionService.runFullSync({
        ...this.currentOptions,
        triggeredBy,
      })

      this.lastRunAt = new Date()
      this.lastResult = result
      this.totalRuns++

      // eslint-disable-next-line no-console
      console.log(
        `✅ [MovieSyncScheduler]: Sync completed in ${result.durationMs}ms: +${result.newInserted} new movies, ${result.updated} updated, ${result.totalProcessed} total processed.`
      )

      return result
    } finally {
      this.isSyncRunning = false
    }
  }

  /**
   * Manually trigger an immediate full sync
   */
  public static async triggerSyncNow(triggeredBy = 'admin_user'): Promise<SyncResult> {
    return this.executeSync(triggeredBy)
  }

  /**
   * Returns current telemetry and status of the automated sync worker
   */
  public static getStatus(): SchedulerStatus {
    return {
      isRunning: this.isSyncRunning,
      autoSyncEnabled: this.autoSyncEnabled,
      intervalMinutes: this.intervalMinutes,
      lastRunAt: this.lastRunAt ? this.lastRunAt.toISOString() : null,
      nextRunAt: this.nextRunAt ? this.nextRunAt.toISOString() : null,
      totalRuns: this.totalRuns,
      lastResult: this.lastResult,
      sources: this.currentOptions,
    }
  }

  /**
   * Graceful stop of the scheduler
   */
  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.isRunning = false
    // eslint-disable-next-line no-console
    console.log('[MovieSyncScheduler]: Automated Movie Sync Scheduler stopped cleanly.')
  }
}
