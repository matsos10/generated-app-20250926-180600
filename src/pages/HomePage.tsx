import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, BarChart3, Bot, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
export function HomePage() {
  const navigate = useNavigate();
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
      title: 'AI-Powered Dashboards',
      description: 'Automated reporting and predictive analytics to track KPIs effortlessly and anticipate market trends.',
    },
    {
      icon: <Bot className="h-8 w-8 text-indigo-500" />,
      title: 'Decision Assistant',
      description: 'Leverage our AI assistant to analyze complex scenarios and receive data-driven recommendations.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />,
      title: 'Performance Alerts',
      description: 'Get automatic alerts on performance deviations, allowing you to take corrective action proactively.',
    },
  ];
  const testimonials = [
    {
      quote: "ClarityDash has transformed our decision-making process. We're faster, more informed, and more aligned than ever before.",
      name: 'Jane Doe',
      title: 'CEO, TechCorp',
    },
    {
      quote: 'The predictive analytics are a game-changer. We can now see around corners and prepare for the future with confidence.',
      name: 'John Smith',
      title: 'COO, Innovate Inc.',
    },
    {
      quote: 'I finally have a single source of truth for all our critical KPIs. The time saved on reporting alone is invaluable.',
      name: 'Emily White',
      title: 'Head of Strategy, Solutions Co.',
    },
  ];
  const pricingTiers = [
    {
      name: 'Starter',
      price: '$49',
      features: ['AI Dashboard', 'KPI Tracking', 'Weekly Reports', 'Email Support'],
    },
    {
      name: 'Pro',
      price: '$99',
      features: ['All in Starter', 'Predictive Analytics', 'AI Decision Assistant', 'Priority Support'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      features: ['All in Pro', 'Custom Integrations', 'Dedicated Account Manager', 'On-premise Option'],
    },
  ];
  const faqItems = [
    {
      question: 'What is ClarityDash?',
      answer: 'ClarityDash is an AI-powered SaaS platform for executive management providing intelligent dashboards, decision support, and performance monitoring to transform raw data into actionable intelligence.',
    },
    {
      question: 'How does the 14-day free trial work?',
      answer: 'You can sign up and get full access to all features on our Pro plan for 14 days without any credit card required. At the end of the trial, you can choose a plan that fits your needs.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take data security very seriously. We use bank-grade encryption for all data in transit and at rest. Our infrastructure is built on top of Cloudflare, ensuring world-class security and reliability.',
    },
    {
      question: 'Can I integrate ClarityDash with my existing tools?',
      answer: 'Our Enterprise plan offers custom integrations with a wide range of business tools, including CRMs, ERPs, and financial software. Contact our sales team to discuss your specific needs.',
    },
  ];
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 md:py-32 lg:py-40 text-center">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                Drive Your Business with <span className="text-indigo-600">AI-Powered Clarity</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                ClarityDash transforms your complex data into actionable insights, empowering your leadership team to make smarter, faster decisions.
              </p>
              <div className="mt-10 flex justify-center gap-x-6">
                <Button size="lg" onClick={() => navigate('/signup')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:-translate-y-1 transition-transform">
                  Start 14-day free trial
                </Button>
                <Button size="lg" variant="outline" onClick={() => { /* Demo link */ }}>
                  Request a Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything you need to lead with confidence
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Focus on what matters most with our intelligent suite of tools.
              </p>
            </div>
            <motion.div
              className="mt-16 grid gap-8 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 dark:bg-indigo-900 mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Trusted by Leaders Worldwide
              </h2>
            </div>
            <motion.div
              className="mt-16 grid gap-8 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {testimonials.map((testimonial, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <p className="text-lg text-gray-700 dark:text-gray-200">"{testimonial.quote}"</p>
                      <div className="mt-6 font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Choose the plan that's right for your team.
              </p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-2 border-indigo-600' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      {tier.name}
                      {tier.popular && <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">POPULAR</span>}
                    </CardTitle>
                    <div className="text-4xl font-bold">{tier.price}</div>
                    <div className="text-sm text-gray-500">{tier.price.startsWith('$') ? '/ month' : ''}</div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-4 text-gray-600 dark:text-gray-300 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full mt-8 ${tier.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`} variant={tier.popular ? 'default' : 'outline'}>
                      {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full mt-12">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}