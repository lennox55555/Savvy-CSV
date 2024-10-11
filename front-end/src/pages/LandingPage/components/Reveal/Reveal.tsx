import React, { useEffect } from "react";
import { useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface RevealProps {
    children: JSX.Element
}

const Reveal: React.FC<RevealProps> = ({ children }) => {

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-20px" });
    const mainControls = useAnimation();
    const slideControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible')
            slideControls.start('visible')
        }
    }, [isInView])

    return (
        <div ref={ref}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                }}
                initial='hidden'
                animate={mainControls}
                transition={{ duration: 1, delay: 0.10 }}
            >
                {children}

            </motion.div>
        </div>
    );
}

export default Reveal