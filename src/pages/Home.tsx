import { useState } from 'react';
import { Hero } from '../components/Hero';
import { Properties } from '../components/Properties';
import { HowItWorks } from '../components/HowItWorks';
import { Diferenciais } from '../components/Diferenciais';
import { Stats } from '../components/Stats';
import { About } from '../components/About';
import { Calculator } from '../components/Calculator';
import { CTAFinal } from '../components/CTAFinal';
import { Quiz } from '../components/Quiz';

export function Home() {
    const [quizOpen, setQuizOpen] = useState(false);

    return (
        <>
            <main>
                {/* Section 1: Hero */}
                <Hero onOpenQuiz={() => setQuizOpen(true)} />

                {/* Section 2: Featured Properties */}
                <Properties />

                {/* Section 3: How It Works */}
                <HowItWorks />

                {/* Section 4: Quiz CTA + Diferenciais */}
                <Diferenciais onOpenQuiz={() => setQuizOpen(true)} />

                {/* Section 5: Stats Counter */}
                <Stats />

                {/* Section 6: About */}
                <About />

                {/* Section 8: Calculator */}
                <Calculator />

                {/* Section 9: Final CTA */}
                <CTAFinal />
            </main>

            {/* Quiz Modal */}
            <Quiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
        </>
    );
}
