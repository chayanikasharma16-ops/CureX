import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import {
  MessageSquare,
  Sparkles,
  AlertCircle,
  Lightbulb,
  ThumbsUp,
  Send,
  Filter,
  CheckCircle2,
  User,
  ShieldCheck,
  Stethoscope,
  CornerDownRight,
  MessageCircle,
  Database,
  Download,
  Info,
  Mail,
  ExternalLink,
  RefreshCw,
  Settings,
  Check,
  Clock,
  Eye,
  SlidersHorizontal,
  XCircle,
  AlertTriangle,
  Key,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';

export type FeedbackCategory = 'ai_problem' | 'suggestion';

export const FOUNDER_EMAIL = 'alwayzsweetchinu@gmail.com';

export interface CommentItem {
  id: string;
  category: FeedbackCategory;
  authorName: string;
  authorRole: string; // e.g., 'Patient', 'Physician', 'Visitor'
  title: string;
  content: string;
  aiOriginalQuery?: string;
  suggestedCorrection?: string;
  timestamp: string;
  upvotes: number;
  replies?: { author: string; text: string; timestamp: string }[];
  dispatchedToEmail?: string;
  gmailComposeUrl?: string;
  mailtoUrl?: string;
  emailStatus?: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c-1',
    category: 'ai_problem',
    authorName: 'Dr. Vivek Mehra',
    authorRole: 'Consultant Cardiologist · Jaipur',
    title: 'Clarification on pediatric fever dosing advice',
    content: 'When asked about high fever in infants under 3 months, the AI suggested checking fever for 24 hours first. For infants under 3 months with temperature > 100.4°F (38°C), clinical guidelines mandate immediate pediatric emergency evaluation to rule out serious bacterial infection, not watchful waiting.',
    aiOriginalQuery: 'What to do for 2-month infant with 101F fever?',
    suggestedCorrection: 'Always immediately refer neonatal and infant fevers (< 3 months) to the emergency room or pediatrician immediately before administering antipyretics.',
    timestamp: '2 hours ago',
    upvotes: 24,
    dispatchedToEmail: FOUNDER_EMAIL,
    replies: [
      {
        author: 'Savya Sharma (Founder & CTO, CureX)',
        text: 'Thank you Dr. Mehra! We received this alert at alwayzsweetchinu@gmail.com and immediately updated the triage algorithm with strict < 3 month emergency routing.',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: 'c-2',
    category: 'suggestion',
    authorName: 'Priya Narang',
    authorRole: 'Patient Caregiver · New Delhi',
    title: 'Add Hindi and regional language voice notes to medicine tracker',
    content: 'The 3D heart and verified specialist booking are breathtaking! A suggestion for the daily medicine tracker: please add Hindi voice reminders so elderly grandparents who cannot read English screen text can easily understand their morning and night doses.',
    timestamp: 'Yesterday',
    upvotes: 42,
    dispatchedToEmail: FOUNDER_EMAIL,
    replies: [
      {
        author: 'Shravya Garg (Co-Founder & COO, CureX)',
        text: 'Wonderful suggestion Priya! Gunjan and Purvansh on our design team are actively integrating bilingual voice reminders.',
        timestamp: '20 hours ago',
      },
    ],
  },
  {
    id: 'c-3',
    category: 'ai_problem',
    authorName: 'Aarav Singhania',
    authorRole: 'Pharmacology Researcher · Mumbai',
    title: 'Grapefruit interaction with statins nuance',
    content: 'The assistant correctly noted that Atorvastatin lowers LDL, but did not mention that excessive consumption of grapefruit juice inhibits CYP3A4 metabolism, significantly increasing statin serum levels and rhabdomyolysis risk.',
    aiOriginalQuery: 'Dietary cautions while taking Atorvastatin 20mg?',
    suggestedCorrection: 'Include a specific advisory warning against grapefruit and Seville oranges for patients on CYP3A4-metabolized statins (atorvastatin, simvastatin).',
    timestamp: '3 days ago',
    upvotes: 19,
    dispatchedToEmail: FOUNDER_EMAIL,
    replies: [
      {
        author: 'Gunjan Maheshwari (Co-Founder & Head of Clinical Reviews & PR)',
        text: 'Thank you Aarav! Our clinical audit team has validated this cytochrome P450 contraindication.',
        timestamp: '2 days ago',
      },
    ],
  },
  {
    id: 'c-4',
    category: 'suggestion',
    authorName: 'Col. R.S. Rathore (Retd.)',
    authorRole: 'Elderly Patient · Jaipur',
    title: 'SMS Hospital trauma route directions are very helpful',
    content: 'The hospital radar accurately showed the emergency gate location for SMS Hospital Jaipur with direct phone numbers. My suggestion is to also include estimated waiting times at emergency triage desks if possible.',
    timestamp: '4 days ago',
    upvotes: 31,
    dispatchedToEmail: FOUNDER_EMAIL,
    replies: [
      {
        author: 'Purvansh Nehra (Co-Founder & Chief Designer)',
        text: 'Thank you Colonel! We are designing live queue telemetry for major government trauma hospitals next.',
        timestamp: '3 days ago',
      },
    ],
  },
];

interface CommunityFeedbackProps {
  prefilledAiQuery?: string;
  prefilledAiAnswer?: string;
  onClearPrefill?: () => void;
}

export default function CommunityFeedback({
  prefilledAiQuery = '',
  prefilledAiAnswer = '',
  onClearPrefill,
}: CommunityFeedbackProps) {
  const [comments, setComments] = useState<CommentItem[]>(() => {
    const saved = localStorage.getItem('curex_comments_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COMMENTS;
      }
    }
    return INITIAL_COMMENTS;
  });

  const [filter, setFilter] = useState<'all' | 'ai_problem' | 'suggestion'>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showWhereCommentsGoInfo, setShowWhereCommentsGoInfo] = useState<boolean>(false);
  const [showEmailActivityModal, setShowEmailActivityModal] = useState<boolean>(false);
  const [emailModalTab, setEmailModalTab] = useState<'dispatches' | 'config'>('dispatches');

  // STRICT REQUIREMENT 3 & 8:
  // Read keys strictly from VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.
  // Remove fake defaults "service_curex_alerts" and "template_comment_box". Do not rely on localStorage for the keys.
  // Never put an EmailJS private key in frontend code.
  const EMAILJS_SERVICE_ID = ((import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || '').trim();
  const EMAILJS_TEMPLATE_ID = ((import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || '').trim();
  const EMAILJS_PUBLIC_KEY = ((import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || '').trim();
  const isEmailjsConfigured = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

  // Email Dispatches Log state
  const [emailDispatches, setEmailDispatches] = useState<any[]>([]);
  const [loadingDispatches, setLoadingDispatches] = useState<boolean>(false);
  const [isTestingEmail, setIsTestingEmail] = useState<boolean>(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; msg: string; gmailUrl?: string } | null>(null);

  // Form State
  const [category, setCategory] = useState<FeedbackCategory>('ai_problem');
  const [authorName, setAuthorName] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<string>('Patient');
  const [authorEmail, setAuthorEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [aiOriginalQuery, setAiOriginalQuery] = useState<string>('');
  const [suggestedCorrection, setSuggestedCorrection] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showInlineConfig, setShowInlineConfig] = useState<boolean>(false);

  // STRICT REQUIREMENT 5 & 6:
  // Only show "Sent successfully" when emailjs.send returns status 200.
  // If it fails, show the real EmailJS error text on screen.
  // Save the comment to the feed even if the email fails, and show a clear warning.
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);
  const [submitWarningNotice, setSubmitWarningNotice] = useState<{
    message: string;
    errorDetail: string;
    gmailComposeUrl: string;
    mailtoUrl: string;
  } | null>(null);

  // Quick Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState<string>('Savya Sharma (Founder & CTO, CureX)');
  const [replyText, setReplyText] = useState<string>('');

  // Fetch comments from backend server on load
  useEffect(() => {
    fetch('/api/comments')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch from server');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setComments(data);
          localStorage.setItem('curex_comments_v3', JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.log('Using local comments cache:', err.message);
      });

    fetchEmailDispatches();
  }, []);

  const fetchEmailDispatches = async () => {
    setLoadingDispatches(true);
    try {
      const res = await fetch('/api/email-dispatches');
      if (res.ok) {
        const data = await res.json();
        if (data.dispatches && Array.isArray(data.dispatches)) {
          setEmailDispatches(data.dispatches);
        }
      }
    } catch (err) {
      console.warn('Could not load email dispatches:', err);
    } finally {
      setLoadingDispatches(false);
    }
  };

  // STRICT REQUIREMENT 7:
  // Keep the "Send test email" button working with the same browser-side method.
  const handleSendTestEmail = async () => {
    setIsTestingEmail(true);
    setTestEmailResult(null);

    const testSubject = `[CureX Alert] Test Notification to ${FOUNDER_EMAIL}`;
    const testBody = `Hello!\n\nThis is a test notification confirming that CureX community feedback alerts are directed to ${FOUNDER_EMAIL}.\n\nTimestamp: ${new Date().toLocaleString()}\nSender: CureX Healthcare Platform`;
    const testGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      FOUNDER_EMAIL
    )}&su=${encodeURIComponent(testSubject)}&body=${encodeURIComponent(testBody)}`;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setTestEmailResult({
        success: false,
        msg: 'EmailJS keys are missing from environment secrets. Please add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in the Secrets panel.',
        gmailUrl: testGmailUrl,
      });
      setIsTestingEmail(false);
      return;
    }

    try {
      // STRICT REQUIREMENT 4:
      // Send these template params: to_email, from_name, reply_to, subject, title, message, category, submitted_at.
      const testParams = {
        to_email: FOUNDER_EMAIL,
        from_name: 'CureX Test Gateway Verifier',
        reply_to: FOUNDER_EMAIL,
        subject: testSubject,
        title: 'Test Notification',
        message: testBody,
        category: 'Website Suggestion',
        submitted_at: new Date().toLocaleString(),
      };

      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        testParams,
        EMAILJS_PUBLIC_KEY
      );

      // STRICT REQUIREMENT 5: Only show "Sent successfully" when emailjs.send returns status 200
      if (res && res.status === 200) {
        setTestEmailResult({
          success: true,
          msg: `Sent successfully! Test email delivered to ${FOUNDER_EMAIL} (Status: 200). Check your inbox!`,
          gmailUrl: testGmailUrl,
        });
      } else {
        const errorText = res?.text || `Status code ${res?.status || 'unknown'}`;
        setTestEmailResult({
          success: false,
          msg: `EmailJS error: ${errorText}`,
          gmailUrl: testGmailUrl,
        });
      }
    } catch (err: any) {
      const realError = err?.text || err?.message || (typeof err === 'string' ? err : 'EmailJS delivery failed');
      setTestEmailResult({
        success: false,
        msg: `EmailJS failed: ${realError}`,
        gmailUrl: testGmailUrl,
      });
    } finally {
      setIsTestingEmail(false);
      fetchEmailDispatches();
    }
  };

  // Auto populate if user came from clicking "Correct AI in Comment Box"
  useEffect(() => {
    if (prefilledAiQuery) {
      setCategory('ai_problem');
      setAiOriginalQuery(prefilledAiQuery);
      setTitle(`AI misunderstanding on: "${prefilledAiQuery.slice(0, 50)}..."`);
      setShowAddForm(true);
    }
  }, [prefilledAiQuery]);

  // Persist comments to local storage
  useEffect(() => {
    localStorage.setItem('curex_comments_v3', JSON.stringify(comments));
  }, [comments]);

  // STRICT REQUIREMENT 2, 3, 4, 5, 6, 8:
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authorName.trim() || !title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccessNotice(null);
    setSubmitWarningNotice(null);

    const categoryLabel = category === 'ai_problem' ? 'AI Problem Understanding' : 'Website Suggestion';
    const emailSubjectText = `[CureX Alert] New ${categoryLabel}: ${title.trim()}`;
    const submittedAt = new Date().toLocaleString();

    // STRICT REQUIREMENT 4:
    // Send these template params: to_email, from_name, reply_to, subject, title, message, category, submitted_at.
    const templateParams = {
      to_email: FOUNDER_EMAIL,
      from_name: `${authorName.trim()}${authorRole.trim() ? ` (${authorRole.trim()})` : ''}`,
      reply_to: authorEmail.trim() || FOUNDER_EMAIL,
      subject: emailSubjectText,
      title: title.trim(),
      message: content.trim(),
      category: categoryLabel,
      submitted_at: submittedAt,
    };

    const fullBodyText = `================================================
CUREX HEALTHCARE PLATFORM - FOUNDER NOTIFICATION
================================================
Target Inbox: ${FOUNDER_EMAIL}
Category: ${categoryLabel}
Submitted By: ${authorName.trim()} (${authorRole.trim() || 'Community Member'})
${authorEmail.trim() ? `Submitter Email: ${authorEmail.trim()}\n` : ''}Time: ${submittedAt}

TITLE:
${title.trim()}

${category === 'ai_problem' && aiOriginalQuery ? `ORIGINAL QUERY ASKED TO AI:
"${aiOriginalQuery.trim()}"

SUGGESTED CLINICAL CORRECTION:
${suggestedCorrection.trim() || 'None provided'}
` : ''}
CONTENT / MESSAGE:
${content.trim()}

------------------------------------------------
Sent from CureX Healthcare Intelligence Platform
------------------------------------------------`;

    const fallbackGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      FOUNDER_EMAIL
    )}&su=${encodeURIComponent(emailSubjectText)}&body=${encodeURIComponent(fullBodyText)}`;

    const fallbackMailtoUrl = `mailto:${encodeURIComponent(FOUNDER_EMAIL)}?subject=${encodeURIComponent(
      emailSubjectText
    )}&body=${encodeURIComponent(fullBodyText)}`;

    // STRICT REQUIREMENT 2: Send the email from the browser only, using @emailjs/browser
    let emailSentSuccessfully = false;
    let emailErrorMessage = '';

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      emailErrorMessage = 'EmailJS keys are missing from Secrets panel. Please add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in the Secrets panel.';
    } else {
      try {
        const res = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        // STRICT REQUIREMENT 5: Only show "Sent successfully" when emailjs.send returns status 200
        if (res && res.status === 200) {
          emailSentSuccessfully = true;
        } else {
          emailErrorMessage = res?.text || `EmailJS returned status code ${res?.status || 'unknown'}`;
        }
      } catch (err: any) {
        emailErrorMessage = err?.text || err?.message || (typeof err === 'string' ? err : 'EmailJS delivery failed');
      }
    }

    // STRICT REQUIREMENT 6: Save the comment to the feed even if the email fails, and show a clear warning.
    const newCommentPayload = {
      category,
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'Community Member',
      authorEmail: authorEmail.trim() || undefined,
      title: title.trim(),
      content: content.trim(),
      aiOriginalQuery: category === 'ai_problem' ? aiOriginalQuery.trim() : undefined,
      suggestedCorrection: category === 'ai_problem' ? suggestedCorrection.trim() : undefined,
    };

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentPayload),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments((prev) => [savedComment, ...prev]);
      } else {
        throw new Error('Backend server did not return 200');
      }
    } catch {
      // Offline fallback
      const localComment: CommentItem = {
        id: `comm-${Date.now()}`,
        category,
        authorName: authorName.trim(),
        authorRole: authorRole.trim() || 'Community Member',
        title: title.trim(),
        content: content.trim(),
        aiOriginalQuery: category === 'ai_problem' ? aiOriginalQuery.trim() : undefined,
        suggestedCorrection: category === 'ai_problem' ? suggestedCorrection.trim() : undefined,
        timestamp: 'Just now',
        upvotes: 1,
        dispatchedToEmail: FOUNDER_EMAIL,
        gmailComposeUrl: fallbackGmailUrl,
        mailtoUrl: fallbackMailtoUrl,
        emailStatus: emailSentSuccessfully ? `Delivered to ${FOUNDER_EMAIL} (Status: 200)` : `Email failed (${emailErrorMessage})`,
      };
      setComments((prev) => [localComment, ...prev]);
    } finally {
      setIsSubmitting(false);
      fetchEmailDispatches();
    }

    // Reset Form Fields
    setTitle('');
    setContent('');
    setAuthorEmail('');
    setAiOriginalQuery('');
    setSuggestedCorrection('');
    setShowAddForm(false);
    if (onClearPrefill) onClearPrefill();

    // STRICT REQUIREMENT 5 & 6:
    // Only show "Sent successfully" when emailjs.send returns status 200.
    // If it fails, show the real EmailJS error text on screen and a clear warning.
    if (emailSentSuccessfully) {
      setSubmitSuccessNotice(
        `Sent successfully! Your comment has been delivered to ${FOUNDER_EMAIL} and published to the CureX community feed.`
      );
    } else {
      setSubmitWarningNotice({
        message: `Your comment was saved to the community feed, but sending the email to ${FOUNDER_EMAIL} failed.`,
        errorDetail: emailErrorMessage,
        gmailComposeUrl: fallbackGmailUrl,
        mailtoUrl: fallbackMailtoUrl,
      });
    }
  };

  const handleUpvote = async (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );

    try {
      await fetch(`/api/comments/${id}/upvote`, { method: 'POST' });
    } catch {
      // Ignored
    }
  };

  const handleSendReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: replyAuthor,
          text: replyText.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      } else {
        throw new Error('Reply error');
      }
    } catch {
      // Offline fallback
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            const replies = c.replies || [];
            return {
              ...c,
              replies: [
                ...replies,
                {
                  author: replyAuthor,
                  text: replyText.trim(),
                  timestamp: 'Just now',
                },
              ],
            };
          }
          return c;
        })
      );
    }

    setReplyText('');
    setReplyingToId(null);
  };

  const handleExportComments = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(comments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `curex_comments_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'all') return true;
    return c.category === filter;
  });

  return (
    <section id="feedback" className="py-20 bg-[#F4F8F6] border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Direct Founder Dispatch & AI Correction Hub
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Feedback, suggestions & AI corrections
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              If the CureX AI gave an incomplete or inaccurate medical answer, tell us in the comment box so we can teach it. If you have suggestions or critique to make CureX better, write them here — every entry is sent directly to the founder inbox at <code className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{FOUNDER_EMAIL}</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            {/* EmailJS & Dispatch Hub button */}
            <button
              onClick={() => {
                setShowEmailActivityModal(true);
                fetchEmailDispatches();
              }}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-950 font-semibold rounded-full border border-emerald-300 text-xs shadow-sm cursor-pointer transition-colors"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 relative" />
              </div>
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>EmailJS & Dispatches ({emailDispatches.length})</span>
            </button>

            {/* Where do comments go button */}
            <button
              onClick={() => setShowWhereCommentsGoInfo(!showWhereCommentsGoInfo)}
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-full border border-slate-200 text-xs shadow-sm cursor-pointer transition-colors"
            >
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Where do comments go?</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full shadow-lg shadow-emerald-800/20 transition-all cursor-pointer text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{showAddForm ? 'Close Form' : 'Write in Comment Box'}</span>
            </button>
          </div>
        </div>

        {/* Direct Email Routing Banner */}
        <div className="mb-8 p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-emerald-950 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Mail className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-[#0A2540]">Target Founder Inbox: {FOUNDER_EMAIL}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEmailjsConfigured
                      ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isEmailjsConfigured
                    ? 'EMAILJS BROWSER AUTO-DELIVERY ACTIVE'
                    : 'EMAILJS KEYS NEEDED IN SECRETS'}
                </span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Every comment, suggestion, and AI correction is formatted and dispatched directly for founder <b className="text-emerald-900 font-mono">{FOUNDER_EMAIL}</b>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                FOUNDER_EMAIL
              )}&su=${encodeURIComponent(`[CureX Alert] Direct Email Verification to ${FOUNDER_EMAIL}`)}&body=${encodeURIComponent(
                `Hello!\n\nThis confirms direct email delivery to ${FOUNDER_EMAIL} from the CureX Healthcare Community Platform.\n\nDate: ${new Date().toLocaleString()}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm transition-colors text-xs cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-200" />
              <span>Open in Gmail (Send Test)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => {
                setShowEmailActivityModal(true);
                setEmailModalTab('config');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg font-semibold hover:bg-emerald-100/60 transition-colors cursor-pointer text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>EmailJS Setup</span>
            </button>

            <button
              onClick={() => {
                setShowEmailActivityModal(true);
                setEmailModalTab('dispatches');
                fetchEmailDispatches();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Logs ({emailDispatches.length})</span>
            </button>
          </div>
        </div>

        {/* Modal: EmailJS & Email Dispatch Dashboard */}
        {showEmailActivityModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-[#071A2E] to-[#0A2540] text-white flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Automated Email Dispatch System
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">
                    Email Notification Gateway to {FOUNDER_EMAIL}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Dual pipeline powered by backend service logging and EmailJS API forwarding.
                  </p>
                </div>
                <button
                  onClick={() => setShowEmailActivityModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => setEmailModalTab('dispatches')}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                    emailModalTab === 'dispatches'
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Live Dispatch History ({emailDispatches.length})
                </button>
                <button
                  onClick={() => setEmailModalTab('config')}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                    emailModalTab === 'config'
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>EmailJS API Credentials & Settings</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
                {emailModalTab === 'dispatches' ? (
                  <>
                    {/* Live Trigger Action Banner */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-emerald-950 text-sm">
                          Verify Email Delivery to {FOUNDER_EMAIL}
                        </div>
                        <p className="text-slate-600 text-xs mt-0.5">
                          Click to send a test alert directly to <code className="font-mono text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">{FOUNDER_EMAIL}</code> and verify the pipeline.
                        </p>
                      </div>
                      <button
                        onClick={handleSendTestEmail}
                        disabled={isTestingEmail}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-60 shadow-sm shrink-0"
                      >
                        {isTestingEmail ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending Test...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Test Alert</span>
                          </>
                        )}
                      </button>
                    </div>

                    {testEmailResult && (
                      <div
                        className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                          testEmailResult.success
                            ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {testEmailResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold leading-relaxed">{testEmailResult.msg}</span>
                          </div>
                        </div>

                        {testEmailResult.gmailUrl && (
                          <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-2">
                            <a
                              href={testEmailResult.gmailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm text-xs cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Open & Send Test in Gmail (1-Click)</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => setEmailModalTab('config')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 rounded-lg font-semibold text-xs cursor-pointer"
                            >
                              <SlidersHorizontal className="w-3 h-3" />
                              <span>Configure EmailJS Keys</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dispatches List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between font-bold text-slate-700 text-xs pb-1">
                        <span>Recent Dispatches to {FOUNDER_EMAIL}</span>
                        <button
                          onClick={fetchEmailDispatches}
                          className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${loadingDispatches ? 'animate-spin' : ''}`} />
                          <span>Refresh</span>
                        </button>
                      </div>

                      {emailDispatches.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500">
                          <Mail className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                          <p className="font-semibold">No emails dispatched yet.</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Write a comment in the form or click "Send Test Alert" to dispatch your first email to {FOUNDER_EMAIL}.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {emailDispatches.map((item: any) => (
                            <div
                              key={item.id}
                              className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition-all space-y-2"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                                      item.category?.includes('AI')
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    }`}
                                  >
                                    {item.category || 'Comment'}
                                  </span>
                                  <h5 className="font-bold text-sm text-[#0A2540]">{item.subject}</h5>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-mono text-[10px] text-slate-400 block">
                                    {item.readableTime || new Date(item.dispatchedAt).toLocaleTimeString()}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Sent to {FOUNDER_EMAIL.split('@')[0]}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="text-slate-600 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                                <div className="text-slate-500 mb-1">
                                  <b>From:</b> {item.author} · <b>To:</b> {FOUNDER_EMAIL}
                                </div>
                                <p className="italic text-slate-700">"{item.content}"</p>
                                {item.suggestedCorrection && (
                                  <div className="mt-2 pt-2 border-t border-slate-100 text-emerald-800">
                                    <b>Correction detail:</b> {item.suggestedCorrection}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                                <span>Dispatch ID: {item.id}</span>
                                {item.gmailComposeUrl && (
                                  <a
                                    href={item.gmailComposeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                                  >
                                    <Mail className="w-3 h-3" />
                                    <span>Resend / Open in Gmail</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* EmailJS Configuration & Secrets Panel Tab */
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-[#0A2540]">
                          Browser-Only EmailJS Secrets Setup
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEmailjsConfigured
                            ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {isEmailjsConfigured ? 'ALL 3 SECRETS DETECTED' : 'SECRETS NEEDED IN SECRETS PANEL'}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-xs">
                        Email alerts are dispatched strictly from the user's browser using <code className="font-mono text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">@emailjs/browser</code> directly to <b className="text-slate-900">{FOUNDER_EMAIL}</b>.
                      </p>
                    </div>

                    {/* Environment Secrets Status Grid */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>Environment Secrets (Detected from Vite build):</span>
                        <span className="text-[11px] text-slate-500 font-normal">Add in AI Studio Secrets tab</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`p-3.5 rounded-2xl border text-xs ${
                          EMAILJS_SERVICE_ID
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-[11px]">VITE_EMAILJS_SERVICE_ID</span>
                            {EMAILJS_SERVICE_ID ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 truncate">
                            {EMAILJS_SERVICE_ID ? `Active: ${EMAILJS_SERVICE_ID.slice(0, 8)}...` : 'Missing in Secrets'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">From EmailJS &rarr; Email Services (e.g. service_xxx)</div>
                        </div>

                        <div className={`p-3.5 rounded-2xl border text-xs ${
                          EMAILJS_TEMPLATE_ID
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-[11px]">VITE_EMAILJS_TEMPLATE_ID</span>
                            {EMAILJS_TEMPLATE_ID ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 truncate">
                            {EMAILJS_TEMPLATE_ID ? `Active: ${EMAILJS_TEMPLATE_ID.slice(0, 8)}...` : 'Missing in Secrets'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">From EmailJS &rarr; Email Templates (e.g. template_xxx)</div>
                        </div>

                        <div className={`p-3.5 rounded-2xl border text-xs ${
                          EMAILJS_PUBLIC_KEY
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-[11px]">VITE_EMAILJS_PUBLIC_KEY</span>
                            {EMAILJS_PUBLIC_KEY ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 truncate">
                            {EMAILJS_PUBLIC_KEY ? 'Active (Public Key)' : 'Missing in Secrets'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">From EmailJS &rarr; Account &gt; API Keys (Public Key)</div>
                        </div>
                      </div>
                    </div>

                    {/* Step by step guide */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-emerald-700" />
                        <span>Secrets Panel Instructions:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 pl-1 leading-relaxed">
                        <li>Open the <b>Secrets</b> panel on the left navigation bar of AI Studio.</li>
                        <li>Add Secret 1: <code className="bg-white font-mono px-1 py-0.5 rounded border border-slate-300 text-slate-900 font-bold">VITE_EMAILJS_SERVICE_ID</code> with your EmailJS service ID (e.g. linked to Gmail).</li>
                        <li>Add Secret 2: <code className="bg-white font-mono px-1 py-0.5 rounded border border-slate-300 text-slate-900 font-bold">VITE_EMAILJS_TEMPLATE_ID</code> with your EmailJS template ID.</li>
                        <li>Add Secret 3: <code className="bg-white font-mono px-1 py-0.5 rounded border border-slate-300 text-slate-900 font-bold">VITE_EMAILJS_PUBLIC_KEY</code> with your EmailJS Public Key.</li>
                        <li className="text-amber-800 font-medium"><b>Security Note:</b> Never provide an EmailJS Private Key / Access Token in frontend code. Only the Public Key is used.</li>
                      </ol>
                    </div>

                    {testEmailResult && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          testEmailResult.success
                            ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {testEmailResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold leading-relaxed">{testEmailResult.msg}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          FOUNDER_EMAIL
                        )}&su=${encodeURIComponent(`[CureX Alert] Direct Test Verification to ${FOUNDER_EMAIL}`)}&body=${encodeURIComponent(
                          `This is an immediate test confirming direct email delivery to ${FOUNDER_EMAIL} from CureX.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Open Gmail Draft (Instant Test)</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={isTestingEmail}
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isTestingEmail ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending via Browser @emailjs/browser...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Test Email via Browser</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Target Founder: {FOUNDER_EMAIL}
                </span>
                <button
                  onClick={() => setShowEmailActivityModal(false)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}



        {/* "Where do comments go?" Informational Panel */}
        {showWhereCommentsGoInfo && (
          <div className="mb-8 p-6 bg-gradient-to-r from-[#071A2E] to-[#0A2540] text-white rounded-3xl border border-emerald-500/30 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-lg">
                <Database className="w-5 h-5" />
                <span>Where do your comments & AI corrections go?</span>
              </div>
              <button
                onClick={() => setShowWhereCommentsGoInfo(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <b className="text-white block font-semibold mb-1 text-sm flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>1. Direct to Founder Email</span>
                </b>
                <p>Every comment is formatted and dispatched directly to <b>{FOUNDER_EMAIL}</b> via EmailJS and CureX Mail Service so the founder is alerted immediately.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <b className="text-white block font-semibold mb-1 text-sm flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>2. Stored in Server Database</span>
                </b>
                <p>Persisted permanently to the CureX server database (<code className="text-emerald-300">/api/comments</code>) so records are preserved.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <b className="text-white block font-semibold mb-1 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>3. Published to Public Feed</span>
                </b>
                <p>Rendered right below with clear bottom tags: <b>Ai problem understanding</b> or <b>It is a suggestion</b>.</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total stored feedback entries: {comments.length}</span>
              <button
                onClick={handleExportComments}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Comments Archive (JSON)</span>
              </button>
            </div>
          </div>
        )}

        {/* STRICT REQUIREMENT 5: Only show "Sent successfully" when emailjs.send returns status 200 */}
        {submitSuccessNotice && (
          <div className="mb-8 p-5 bg-emerald-50 border-2 border-emerald-400 rounded-3xl text-emerald-950 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0A2540]">Sent successfully!</h4>
                  <p className="text-xs text-emerald-900 mt-0.5">{submitSuccessNotice}</p>
                </div>
              </div>
              <button
                onClick={() => setSubmitSuccessNotice(null)}
                className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* STRICT REQUIREMENT 6: Save the comment to the feed even if the email fails, and show a clear warning */}
        {submitWarningNotice && (
          <div className="mb-8 p-5 bg-amber-50 border-2 border-amber-400 rounded-3xl text-amber-950 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-950">
                    Comment Saved to Feed · Email Delivery Notice
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 font-medium">
                    {submitWarningNotice.message}
                  </p>
                  <div className="mt-2 p-2.5 bg-white/90 rounded-xl border border-amber-200 text-xs font-mono text-red-900">
                    <b>EmailJS Error:</b> {submitWarningNotice.errorDetail}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSubmitWarningNotice(null)}
                className="w-7 h-7 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-2">
              <a
                href={submitWarningNotice.gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open in Gmail (Send Guaranteed to {FOUNDER_EMAIL})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={submitWarningNotice.mailtoUrl}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Default Mail App</span>
              </a>

              <button
                onClick={() => {
                  setShowEmailActivityModal(true);
                  setEmailModalTab('config');
                }}
                className="text-xs text-amber-900 font-bold hover:underline ml-auto cursor-pointer"
              >
                View Secrets Panel Instructions &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Comment Form Card */}
        {showAddForm && (
          <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0A2540]">
                  Write in the Comment Box
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dispatches directly to founder inbox: <b className="text-emerald-900 font-mono">{FOUNDER_EMAIL}</b> and displays in the community hub
                </p>
              </div>

              {/* Status Indicator & EmailJS Quick Config Toggle */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                    isEmailjsConfigured
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isEmailjsConfigured
                        ? 'bg-emerald-600 animate-pulse'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span>
                    {isEmailjsConfigured
                      ? 'EmailJS Armed'
                      : 'EmailJS Keys Needed in Secrets'}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => setShowInlineConfig(!showInlineConfig)}
                  className="text-xs text-slate-600 hover:text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Key className="w-3 h-3 text-slate-500" />
                  <span>{showInlineConfig ? 'Hide Secrets Status' : 'Secrets Status'}</span>
                  {showInlineConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Inline EmailJS Secrets Status Accordion */}
            {showInlineConfig && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-emerald-50/40 rounded-2xl border border-emerald-200/80 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-slate-900 text-sm">
                      AI Studio Secrets Panel Status (Destination: {FOUNDER_EMAIL})
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEmailjsConfigured ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {isEmailjsConfigured ? 'SECRETS ACTIVE' : 'MISSING SECRETS'}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  CureX sends comment alerts directly from the browser using <code className="font-mono text-emerald-800 font-semibold">@emailjs/browser</code> to <b className="text-slate-900">{FOUNDER_EMAIL}</b>. Add these 3 secrets in your AI Studio <b>Secrets</b> panel:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className={`p-3 rounded-xl border ${EMAILJS_SERVICE_ID ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="font-mono font-bold text-[11px] text-slate-800">VITE_EMAILJS_SERVICE_ID</div>
                    <div className="text-[10px] font-mono mt-0.5 text-slate-600">
                      {EMAILJS_SERVICE_ID ? `Detected: ${EMAILJS_SERVICE_ID.slice(0, 8)}...` : 'Missing in Secrets'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border ${EMAILJS_TEMPLATE_ID ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="font-mono font-bold text-[11px] text-slate-800">VITE_EMAILJS_TEMPLATE_ID</div>
                    <div className="text-[10px] font-mono mt-0.5 text-slate-600">
                      {EMAILJS_TEMPLATE_ID ? `Detected: ${EMAILJS_TEMPLATE_ID.slice(0, 8)}...` : 'Missing in Secrets'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border ${EMAILJS_PUBLIC_KEY ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="font-mono font-bold text-[11px] text-slate-800">VITE_EMAILJS_PUBLIC_KEY</div>
                    <div className="text-[10px] font-mono mt-0.5 text-slate-600">
                      {EMAILJS_PUBLIC_KEY ? 'Detected: (Public Key)' : 'Missing in Secrets'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-500">
                    Target founder inbox: <b className="font-mono text-emerald-800">{FOUNDER_EMAIL}</b>
                  </span>
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={isTestingEmail}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    {isTestingEmail ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    <span>Send Test Email Now</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector (Strictly: AI thing vs Suggestion) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select what this comment is about:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      category === 'ai_problem'
                        ? 'border-amber-500 bg-amber-50/60 text-amber-950 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="commentCategory"
                      checked={category === 'ai_problem'}
                      onChange={() => setCategory('ai_problem')}
                      className="mt-1 accent-amber-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>AI Problem Understanding / Medical Correction</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Use this if the AI gave an incomplete, confusing, or inaccurate healthcare answer so we can correct it.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      category === 'suggestion'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="commentCategory"
                      checked={category === 'suggestion'}
                      onChange={() => setCategory('suggestion')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Lightbulb className="w-4 h-4 text-emerald-600" />
                        <span>Website Suggestion / Critique</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Use this if you think something is bad, missing, or should be improved on the website.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Author, Role & Optional Submitter Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name or Alias *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh K. or Aditi M."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Role / City
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Patient · Jaipur or General Physician"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Email (Optional, for reply)
                  </label>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Specific fields if AI Problem */}
              {category === 'ai_problem' && (
                <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-950 mb-1">
                      What question/symptom was asked to the AI?
                    </label>
                    <input
                      type="text"
                      value={aiOriginalQuery}
                      onChange={(e) => setAiOriginalQuery(e.target.value)}
                      placeholder="e.g. Can I take ibuprofen with blood pressure medicine?"
                      className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-950 mb-1">
                      What is the correct medical answer or missing detail?
                    </label>
                    <input
                      type="text"
                      value={suggestedCorrection}
                      onChange={(e) => setSuggestedCorrection(e.target.value)}
                      placeholder="e.g. NSAIDs like ibuprofen can blunt ACE inhibitors and cause acute kidney risk..."
                      className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              )}

              {/* Subject Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comment Subject / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    category === 'ai_problem'
                      ? 'e.g. Pediatric dosage for acetaminophen needs weight-based formula'
                      : 'e.g. The doctor appointment date picker would be great with WhatsApp reminders'
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Detailed Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Explanation / Critique *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Share your perspective thoroughly. All feedback is delivered directly to ${FOUNDER_EMAIL} and reviewed by the Cambridge Court World School team...`}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Auto-dispatches to <b className="text-emerald-800">{FOUNDER_EMAIL}</b> via EmailJS</span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setShowAddForm(false);
                      setSubmitWarningNotice(null);
                    }}
                    className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-600/70 text-white font-semibold rounded-full shadow-md transition-colors cursor-pointer text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending to {FOUNDER_EMAIL.split('@')[0]}...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send to Founder & Post</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Feedback ({comments.length})
          </button>
          <button
            onClick={() => setFilter('ai_problem')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'ai_problem'
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Problem Understanding ({comments.filter((c) => c.category === 'ai_problem').length})</span>
          </button>
          <button
            onClick={() => setFilter('suggestion')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'suggestion'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
            <span>Website Suggestions ({comments.filter((c) => c.category === 'suggestion').length})</span>
          </button>
        </div>

        {/* Comments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredComments.map((comment) => {
            const isAiProblem = comment.category === 'ai_problem';

            return (
              <div
                key={comment.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md flex flex-col justify-between ${
                  isAiProblem ? 'border-amber-200/80 hover:border-amber-300' : 'border-emerald-200/80 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          isAiProblem ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {comment.authorName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0A2540]">{comment.authorName}</div>
                        <div className="text-xs text-slate-500">{comment.authorRole}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-mono block">{comment.timestamp}</span>
                      <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 justify-end">
                        <Mail className="w-2.5 h-2.5" /> Sent to {FOUNDER_EMAIL.split('@')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif font-bold text-base text-[#0A2540] mb-2 leading-snug">
                    {comment.title}
                  </h4>

                  {/* AI Query context block if present */}
                  {comment.aiOriginalQuery && (
                    <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="text-slate-500 font-semibold flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Query asked to AI:</span>
                      </div>
                      <div className="text-slate-700 italic">"{comment.aiOriginalQuery}"</div>
                      {comment.suggestedCorrection && (
                        <div className="pt-1.5 mt-1 border-t border-slate-200/60 text-emerald-800">
                          <b>Corrected Insight:</b> {comment.suggestedCorrection}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Comment Text */}
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">{comment.content}</p>

                  {/* Founder / Team Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                      {comment.replies.map((reply, rIdx) => (
                        <div key={rIdx} className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{reply.author}</span>
                            <span className="text-[10px] text-emerald-600 font-normal">· {reply.timestamp}</span>
                          </div>
                          <p className="text-emerald-900 leading-relaxed">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick In-Line Reply form if active */}
                  {replyingToId === comment.id && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reply as Founder:</label>
                        <select
                          value={replyAuthor}
                          onChange={(e) => setReplyAuthor(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="Savya Sharma (Founder & CTO, CureX)">Savya Sharma (Founder & CTO)</option>
                          <option value="Shravya Garg (Co-Founder & COO, CureX)">Shravya Garg (Co-Founder & COO)</option>
                          <option value="Purvansh Nehra (Co-Founder & Chief Designer)">Purvansh Nehra (Co-Founder & Chief Designer)</option>
                          <option value="Gunjan Maheshwari (Co-Founder & Head of Clinical Reviews & PR)">Gunjan Maheshwari (Reviews & PR)</option>
                          <option value="Dravya Poddar (Co-Founder & CFO)">Dravya Poddar (Co-Founder & CFO)</option>
                          <option value="Aadish Gupta (Co-Founder & Chief Product Officer)">Aadish Gupta (Co-Founder & CPO)</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Write official response or acknowledgement..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingToId(null)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendReply(comment.id)}
                          className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CRITICAL USER REQUIREMENT:
                    "then in the comment downside it will be written it is a suggestion or Ai problem understanding" */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isAiProblem
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isAiProblem ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Ai problem understanding</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                          <span>It is a suggestion</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* 1-Click Send / Forward to Founder via Gmail */}
                    <a
                      href={
                        comment.gmailComposeUrl ||
                        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          FOUNDER_EMAIL
                        )}&su=${encodeURIComponent(
                          `[CureX Alert] ${comment.category === 'ai_problem' ? 'AI Problem Understanding' : 'Website Suggestion'}: ${comment.title}`
                        )}&body=${encodeURIComponent(
                          `Author: ${comment.authorName} (${comment.authorRole})\nCategory: ${
                            comment.category === 'ai_problem' ? 'AI Problem Understanding' : 'Website Suggestion'
                          }\nTitle: ${comment.title}\n\nContent:\n${comment.content}\n\n${
                            comment.aiOriginalQuery ? `Original Query: "${comment.aiOriginalQuery}"\nSuggested Correction: "${comment.suggestedCorrection || ''}"\n\n` : ''
                          }Target Founder Inbox: ${FOUNDER_EMAIL}`
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Send directly to ${FOUNDER_EMAIL} in Gmail`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-emerald-600" />
                      <span>Send to Gmail</span>
                    </a>

                    <button
                      onClick={() => setReplyingToId(comment.id)}
                      className="text-xs text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer"
                    >
                      Reply as Founder
                    </button>

                    {/* Upvote button */}
                    <button
                      onClick={() => handleUpvote(comment.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                      <span>Helpful ({comment.upvotes})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
