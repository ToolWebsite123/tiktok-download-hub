import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is it free to download TikTok videos?",
    a: "Yes, our service is completely free. There are no hidden charges, premium plans, or limitations on the number of downloads.",
  },
  {
    q: "Can I download TikTok videos without a watermark?",
    a: "Absolutely! Our tool removes the TikTok watermark so you get clean, high-quality videos ready to share or repost.",
  },
  {
    q: "Do I need to install any software?",
    a: "No installation needed. Our downloader works entirely in your browser on any device — desktop, tablet, or mobile.",
  },
  {
    q: "What video formats are supported?",
    a: "We support MP4 in both HD and SD quality, as well as MP3 audio extraction. Choose the format that best suits your needs.",
  },
  {
    q: "Is it safe to use this website?",
    a: "Yes, our website is completely safe. We don't store your personal data, and all downloads are processed securely.",
  },
  {
    q: "Why is my download not working?",
    a: "Make sure you're pasting a valid TikTok video URL. Private videos or videos with restricted sharing cannot be downloaded. Try copying the link again from the TikTok app.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-md mx-auto">
          Got questions? We've got answers.
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5 shadow-card data-[state=open]:shadow-elevated transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
