import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { useGuestbook } from '../../hooks/useGuestbook'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { GoogleIcon } from '../../components/ui/GoogleIcon'
import {
  MessageSquare,
  Send,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus,
  Loader2,
} from 'lucide-react'

export const GuestbookSection: React.FC = () => {
  const { language } = useLanguage()
  const { user, isAdmin, openAuthModal } = useAuth()
  const {
    entries,
    isLoading,
    isSubmitting,
    postedSuccess,
    submitEntry,
    removeEntry,
  } = useGuestbook()

  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return

    const ok = await submitEntry({
      uid: user.uid,
      name: user.displayName || 'Google User',
      email: user.email || '',
      avatarUrl: user.photoURL || undefined,
      message: newMessage.trim(),
      role: user.role,
      isVerifiedGoogle: true,
    })

    if (ok) {
      setNewMessage('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    await removeEntry(id, user.uid, isAdmin)
  }

  return (
    <section
      id="guestbook"
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Verified Guestbook"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={language === 'vi' ? '05 // SỔ LƯU BÚT XÁC THỰC' : '05 // VERIFIED GUESTBOOK'}
          title={
            language === 'vi'
              ? 'Tường Kết Nối & Lời Nhắn Khách Mời'
              : 'Community Wall & Visitor Endorsements'
          }
          subtitle={
            language === 'vi'
              ? 'Nơi các đồng nghiệp, nhà tuyển dụng và đối tác để lại lời nhắn đã được xác thực danh tính qua Google / Gmail.'
              : 'Public messages and testimonials authenticated with Google / Gmail identity verification.'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form to post message */}
          <div className="lg:col-span-5">
            <Card className="p-6 bg-[#0a1224] border-[#172847]">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#172847]">
                <MessageSquare className="w-4 h-4 text-[#00d2ff]" />
                <h3 className="font-mono text-sm font-bold text-[#f1f5f9] uppercase tracking-wider">
                  {language === 'vi' ? 'Để Lại Lời Nhắn Xác Thực' : 'Leave an Endorsement'}
                </h3>
              </div>

              {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Active User Header */}
                  <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/30 flex items-center gap-3">
                    <img
                      src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full border border-[#00d2ff]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono font-bold text-[#f1f5f9] truncate">
                        {user.displayName}
                      </div>
                      <div className="text-[10px] font-mono text-[#00d2ff] truncate">
                        {user.email}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#34a853]/20 text-[#34a853] font-bold border border-[#34a853]/30">
                      VERIFIED
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="guestbook_msg"
                      className="block text-xs font-mono text-[#94a3b8] uppercase mb-1.5"
                    >
                      {language === 'vi' ? 'Nội dung lời nhắn' : 'Message Content'}
                    </label>
                    <textarea
                      id="guestbook_msg"
                      rows={4}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        language === 'vi'
                          ? 'Chia sẻ nhận xét, lời chúc hoặc đề xuất kết nối của bạn...'
                          : 'Share your thoughts, recommendations, or words of encouragement...'
                      }
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-sm bg-[#070d18] border border-[#172847] focus-visible:border-[#00d2ff] focus-visible:ring-1 focus-visible:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all resize-none outline-none"
                    />
                  </div>

                  {postedSuccess && (
                    <div className="p-2.5 rounded-sm bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-xs font-mono text-[#00d2ff] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        {language === 'vi'
                          ? 'Lời nhắn của bạn đã được đăng thành công!'
                          : 'Your verified message was posted successfully!'}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!newMessage.trim() || isSubmitting}
                    className="w-full justify-center font-mono text-xs uppercase cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 mr-2" />
                    )}
                    <span>
                      {isSubmitting
                        ? language === 'vi'
                          ? 'Đang đăng tải...'
                          : 'Publishing...'
                        : language === 'vi'
                        ? 'Đăng Lời Nhắn (Gắn Huy Hiệu)'
                        : 'Post Verified Message'}
                    </span>
                  </Button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#0f1b33] border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#172847] text-[10px] font-mono text-[#00d2ff] mb-2 font-bold border border-[#00d2ff]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>{language === 'vi' ? 'CHẾ ĐỘ KHÁCH (GUEST MODE)' : 'GUEST MODE ACTIVE'}</span>
                    </div>
                    <h4 className="text-sm font-mono font-bold text-[#f1f5f9] mb-1.5">
                      {language === 'vi'
                        ? 'Yêu Cầu Đăng Ký / Đăng Nhập'
                        : 'Authentication Required'}
                    </h4>
                    <p className="text-xs text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                      {language === 'vi'
                        ? 'Bạn đang duyệt trang ở chế độ khách. Để gửi lời nhắn lên Sổ lưu bút và mở khóa các tính năng tương tác của Portfolio trong tương lai, vui lòng đăng nhập hoặc tạo tài khoản mới.'
                        : 'You are browsing in guest mode. To post endorsements and access upcoming interactive features, please sign in or create a new account.'}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1 font-mono">
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-sm bg-white hover:bg-slate-100 text-[#050a14] text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
                    >
                      <GoogleIcon className="w-4 h-4 shrink-0" />
                      <span>
                        {language === 'vi' ? 'Tiếp tục với Google / Gmail' : 'Continue with Google Account'}
                      </span>
                    </button>

                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => openAuthModal('signin')}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm border border-[#172847] bg-[#070d18] hover:border-[#00d2ff] text-[#f1f5f9] hover:text-[#00d2ff] text-xs font-bold transition-all cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#00d2ff]" />
                        <span>{language === 'vi' ? 'Đăng Nhập' : 'Sign In'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openAuthModal('signup')}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm border border-[#00d2ff]/60 bg-[#0c182e] hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050a14] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,210,255,0.2)] cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Đăng Ký' : 'Sign Up'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Wall of messages */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading && (
              <div className="p-12 text-center text-xs font-mono text-[#00d2ff] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>[SYNCING_COMMUNITY_LEDGER...]</span>
              </div>
            )}

            {!isLoading && entries.length === 0 && (
              <div className="p-12 text-center rounded-sm bg-[#0a1224] border border-[#172847] text-[#94a3b8] font-mono text-xs">
                {language === 'vi'
                  ? 'Chưa có lời nhắn nào. Hãy là người đầu tiên để lại lời nhắn!'
                  : 'No entries yet. Be the first to leave an endorsement!'}
              </div>
            )}

            {!isLoading &&
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-sm bg-[#0a1224] border border-[#172847] hover:border-[#00d2ff]/40 transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[#172847]">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          entry.avatarUrl ||
                          'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'
                        }
                        alt={entry.name}
                        className="w-8 h-8 rounded-full border border-[#00d2ff]/50 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#f1f5f9]">
                            {entry.name}
                          </span>
                          {entry.role === 'admin' ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-xs bg-[#00d2ff] text-[#050a14] font-bold">
                              ADMIN
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-xs bg-[#34a853]/20 text-[#34a853] font-bold border border-[#34a853]/30">
                              GOOGLE_VERIFIED
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[#64748b]">
                          {entry.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#64748b]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                      </div>

                      {/* Admin moderation delete button */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 rounded-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Xóa lời nhắn (Quyền Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#cbd5e1] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                    {entry.message}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
