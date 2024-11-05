import { Button } from "@/components/ui/button";
import Section from "../_components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What is this tool for?",
      answer: (
        <span>
          This tool is for creating, conducting, and analyzing tree tests. Tree tests are a type of
          usability test that helps you evaluate the findability of topics in a website or app. They
          are used to optimize information architecture and navigation paths.
        </span>
      ),
    },
    {
      question: "Is this tool free?",
      answer: (
        <span>
          Yes, this tool is completely free and open-source (for now). Paid versions are planned for
          the future.
        </span>
      ),
    },
    {
      question: "How often is it updated?",
      answer: (
        <span>
          I&apos;ll try to update it as often as possible, but I can&apos;t make any promises. If
          you have any suggestions or requests, please let me know through GitHub issues.
        </span>
      ),
    },
    {
      question: "I encountered a bug; what should I do?",
      answer: (
        <span>
          Please report the bug on{" "}
          <Button variant="linkHover1" className="p-0 after:w-12">
            <a href="https://github.com/ubergonmx/usabilitree/issues/new" target="_blank">
              GitHub
            </a>
          </Button>{" "}
          or DM me on{" "}
          <Button variant="linkHover1" className="p-0 after:w-[52px]">
            <a href="https://discord.com/users/263841596213035009" target="_blank">
              Discord
            </a>
          </Button>
          . I&apos;ll try to fix it as soon as possible. If you can fix it yourself, please submit a
          pull request.
        </span>
      ),
    },
  ];

  return (
    <Section title="FAQ" subtitle="Frequently asked questions">
      <div className="mx-auto my-12 md:max-w-[800px]">
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col items-center justify-center space-y-2"
        >
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={faq.question}
              className="w-full overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="px-4">{faq.question}</AccordionTrigger>
              <AccordionContent className="px-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {/* <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
        Still have questions? Email us at{" "}
        <a href={`mailto:${siteConfig.links.email}`} className="underline">
          {siteConfig.links.email}
        </a>
      </h4> */}
    </Section>
  );
}
