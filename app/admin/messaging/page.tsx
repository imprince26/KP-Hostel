"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Users,
  Send,
  Search,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export default function MessagingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Message type
  const [messageType, setMessageType] = useState<"email" | "sms" | "both">("email");

  // Recipients
  const [recipientType, setRecipientType] = useState<"all" | "block" | "gender" | "custom">("all");
  const [recipientFilter, setRecipientFilter] = useState("");
  const [recipientCount, setRecipientCount] = useState(0);

  // Custom recipients
  const [studentSearch, setStudentSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  // Email content
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  // SMS content
  const [smsContent, setSmsContent] = useState("");

  // Templates
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Results
  const [sendResults, setSendResults] = useState<any>(null);

  // Confirmation dialog
  const [sendConfirmDialog, setSendConfirmDialog] = useState<{
    isOpen: boolean;
    recipientCount: number;
  }>({ isOpen: false, recipientCount: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (recipientType !== "custom") {
      fetchRecipientCount();
    } else {
      setRecipientCount(selectedStudents.length);
    }
  }, [recipientType, recipientFilter, selectedStudents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (studentSearch && studentSearch.length >= 2) {
        searchStudents();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [studentSearch]);

  const fetchRecipientCount = async () => {
    if (recipientType === "all") {
      try {
        const res = await fetch("/api/admin/messaging/send?recipientType=all");
        const data = await res.json();
        if (res.ok) {
          setRecipientCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    } else if ((recipientType === "block" || recipientType === "gender") && recipientFilter) {
      try {
        const res = await fetch(
          `/api/admin/messaging/send?recipientType=${recipientType}&recipientFilter=${recipientFilter}`
        );
        const data = await res.json();
        if (res.ok) {
          setRecipientCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    }
  };

  const searchStudents = async () => {
    try {
      const res = await fetch(
        `/api/admin/messaging/students?search=${encodeURIComponent(studentSearch)}`
      );
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.students);
      }
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  const addStudent = (student: Student) => {
    if (!selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
    setStudentSearch("");
    setSearchResults([]);
  };

  const removeStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  const applyTemplate = (template: string) => {
    switch (template) {
      case "payment_reminder":
        setEmailSubject("Payment Reminder - Semester Fees Due");
        setEmailContent(
          "<p>Dear Student,</p><p>This is a friendly reminder that your semester fees payment is due.</p><p>Please ensure payment is completed by the due date to avoid any inconvenience.</p><p>Thank you,<br>KP Vidhyarthi Bhavan</p>"
        );
        setSmsContent("Payment reminder: Your semester fees are due. Please complete payment at the earliest.");
        break;
      case "maintenance":
        setEmailSubject("Hostel Maintenance Notice");
        setEmailContent(
          "<p>Dear Residents,</p><p>This is to inform you about scheduled maintenance work in the hostel premises.</p><p>We apologize for any inconvenience caused.</p><p>Thank you for your cooperation,<br>KP Vidhyarthi Bhavan</p>"
        );
        setSmsContent("Hostel maintenance scheduled. Please cooperate with the maintenance team.");
        break;
      case "event":
        setEmailSubject("Upcoming Hostel Event");
        setEmailContent(
          "<p>Dear Students,</p><p>We are excited to announce an upcoming event at the hostel!</p><p>Stay tuned for more details.</p><p>Best regards,<br>KP Vidhyarthi Bhavan</p>"
        );
        setSmsContent("Exciting hostel event coming up! Check your email for details.");
        break;
      case "emergency":
        setEmailSubject("Important: Emergency Notice");
        setEmailContent(
          "<p>Dear Residents,</p><p><strong>This is an important emergency notice.</strong></p><p>Please follow the instructions provided by the hostel management.</p><p>KP Vidhyarthi Bhavan</p>"
        );
        setSmsContent("EMERGENCY NOTICE: Please check your email immediately for important information.");
        break;
    }
    setSelectedTemplate(template);
  };

  const handleSendMessages = async () => {
    // Validation
    if (recipientType === "custom" && selectedStudents.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    if ((messageType === "email" || messageType === "both") && (!emailSubject || !emailContent)) {
      toast.error("Email subject and content are required");
      return;
    }

    if ((messageType === "sms" || messageType === "both") && !smsContent) {
      toast.error("SMS content is required");
      return;
    }

    // Show confirmation dialog
    setSendConfirmDialog({ isOpen: true, recipientCount });
  };

  const confirmSendMessage = async () => {
    try {
      setLoading(true);
      setSendConfirmDialog({ isOpen: false, recipientCount: 0 });
      const res = await fetch("/api/admin/messaging/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageType,
          recipientType,
          recipientFilter: recipientType !== "custom" ? recipientFilter : null,
          customRecipients: recipientType === "custom" ? selectedStudents.map((s) => s.id) : null,
          emailSubject,
          emailContent,
          smsContent,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Messages sent successfully!");
        setSendResults(data.results);
        // Reset form
        setEmailSubject("");
        setEmailContent("");
        setSmsContent("");
        setSelectedStudents([]);
        setRecipientType("all");
        setRecipientFilter("");
      } else {
        toast.error(data.error || "Failed to send messages");
      }
    } catch (error) {
      console.error("Error sending messages:", error);
      toast.error("Failed to send messages");
    } finally {
      setLoading(false);
    }
  };

  const smsCharCount = smsContent.length;
  const smsSegments = Math.ceil(smsCharCount / 160);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Messaging</h1>
        <p className="text-muted-foreground">Send emails and SMS to students</p>
      </div>

      {/* Results Card */}
      {sendResults && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">Messages Sent Successfully!</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Recipients</div>
                  <div className="text-2xl font-bold text-green-700">{sendResults.total}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Emails Sent</div>
                  <div className="text-2xl font-bold text-green-700">{sendResults.emailsSent}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">SMS Sent</div>
                  <div className="text-2xl font-bold text-green-700">{sendResults.smsSent}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Failed</div>
                  <div className="text-2xl font-bold text-red-600">{sendResults.failed}</div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSendResults(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Message Type */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Message Type</h3>
            <div className="space-y-2">
              <div
                onClick={() => setMessageType("email")}
                className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition ${messageType === "email" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
              >
                <Mail className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">Email Only</div>
                  <div className="text-xs text-muted-foreground">Send via email</div>
                </div>
              </div>
              <div
                onClick={() => setMessageType("sms")}
                className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition ${messageType === "sms" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
              >
                <MessageSquare className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">SMS Only</div>
                  <div className="text-xs text-muted-foreground">Send via SMS</div>
                </div>
              </div>
              <div
                onClick={() => setMessageType("both")}
                className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition ${messageType === "both" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
              >
                <Users className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">Both</div>
                  <div className="text-xs text-muted-foreground">Email + SMS</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recipients */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recipients</h3>
            <div className="space-y-4">
              <div>
                <Label>Recipient Type</Label>
                <Select value={recipientType} onValueChange={(v: any) => setRecipientType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="block">By Block</SelectItem>
                    <SelectItem value="gender">By Gender</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recipientType === "block" && (
                <div>
                  <Label>Select Block</Label>
                  <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Block A</SelectItem>
                      <SelectItem value="B">Block B</SelectItem>
                      <SelectItem value="C">Block C</SelectItem>
                      <SelectItem value="D">Block D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {recipientType === "gender" && (
                <div>
                  <Label>Select Gender</Label>
                  <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {recipientType === "custom" && (
                <div>
                  <Label>Search Students</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email"
                      className="pl-10"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                      {searchResults.map((student) => (
                        <div
                          key={student.id}
                          onClick={() => addStudent(student)}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                        >
                          <div className="font-medium text-sm">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedStudents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 bg-blue-50 rounded"
                        >
                          <div className="text-sm">{student.name}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeStudent(student.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Recipients:</span>
                  <Badge className="bg-blue-500">{recipientCount}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Templates */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Templates</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => applyTemplate("payment_reminder")}
              >
                Payment Reminder
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => applyTemplate("maintenance")}
              >
                Maintenance Notice
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => applyTemplate("event")}
              >
                Event Announcement
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600"
                onClick={() => applyTemplate("emergency")}
              >
                Emergency Notice
              </Button>
            </div>
          </Card>
        </div>

        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Composer */}
          {(messageType === "email" || messageType === "both") && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5" />
                <h3 className="font-semibold">Email Message</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Subject *</Label>
                  <Input
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Content *</Label>
                  <RichTextEditor value={emailContent} onChange={setEmailContent} />
                </div>
              </div>
            </Card>
          )}

          {/* SMS Composer */}
          {(messageType === "sms" || messageType === "both") && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                <h3 className="font-semibold">SMS Message</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Content *</Label>
                  <Textarea
                    placeholder="SMS message content"
                    value={smsContent}
                    onChange={(e) => setSmsContent(e.target.value)}
                    rows={6}
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{smsCharCount} / 500 characters</span>
                    <span>
                      {smsSegments} SMS segment{smsSegments > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <strong>Note:</strong> SMS functionality requires integration with an SMS
                      service provider (Twilio, AWS SNS, etc.). Currently in development mode.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Send Button */}
          <Card className="p-6">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSendMessages}
              disabled={loading || recipientCount === 0}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to {recipientCount} Recipient{recipientCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>

      {/* Send Confirmation Dialog */}
      <ConfirmationDialog
        open={sendConfirmDialog.isOpen}
        onOpenChange={(open) => !open && setSendConfirmDialog({ isOpen: false, recipientCount: 0 })}
        onConfirm={confirmSendMessage}
        title="Send Message"
        description={`Are you sure you want to send this message to ${sendConfirmDialog.recipientCount} recipient(s)?`}
        confirmText="Send"
        variant="default"
      />
    </div>
  );
}
