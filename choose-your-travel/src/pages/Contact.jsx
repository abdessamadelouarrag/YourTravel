import { useState } from "react";
import { Mail, ArrowUpRight, Check, Copy } from "lucide-react";
import { Button } from "../components/ui";
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" }),
    [prepared, setPrepared] = useState(false),
    [copied, setCopied] = useState(false);
  const message = `Hello Choose Your Travel,\n\n${form.message}\n\n${form.name}\n${form.email}`;
  return (
    <div className="page-shell">
      <section className="container contact-layout">
        <div>
          <span className="eyebrow">EVERY GOOD STORY STARTS WITH HELLO</span>
          <h1>
            A little <span className="serif">conversation.</span>
            <br />A world of possibility.
          </h1>
          <p>
            Have an idea, a question, or a place you think we should know about?
            We’d love to hear it.
          </p>
          <div className="contact-note">
            <Mail size={24} />
            <div>
              <h3>Make a little connection</h3>
              <p>
                This frontend demo prepares your message locally. No message is
                submitted or sent.
              </p>
            </div>
          </div>
        </div>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            setPrepared(true);
          }}
        >
          <label>
            Your name
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="The name you go by"
              maxLength={100}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setPrepared(false);
              }}
            />
          </label>
          <label>
            Email address
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@somewhere.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setPrepared(false);
              }}
            />
          </label>
          <label>
            What’s on your mind?
            <textarea
              required
              name="message"
              rows={5}
              minLength={10}
              maxLength={3000}
              placeholder="A thought, a question, a little inspiration…"
              value={form.message}
              onChange={(e) => {
                setForm({ ...form, message: e.target.value });
                setPrepared(false);
              }}
            />
          </label>
          <Button type="submit">
            Prepare my message
            <ArrowUpRight size={17} />
          </Button>
          {prepared && (
            <div className="contact-prepared" role="status">
              <Check size={20} />
              <div>
                <strong>Your message is ready.</strong>
                <p>
                  Copy it into your preferred email app and choose your own
                  recipient. This demo has no monitored inbox.
                </p>
                <button
                  type="button"
                  className="text-link"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(message);
                      setCopied(true);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  <Copy size={15} />
                  {copied ? "Copied to clipboard" : "Copy message"}
                </button>
                <pre>{message}</pre>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
