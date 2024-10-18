import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './LandingPage.module.css'
import Reveal from "./components/Reveal/Reveal";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import tutorialVideo from '../../assets/savvybot-tutorial.mp4';
import SavvyLogo from "./components/Savvy3DLogo/Savvy3DLogo";
import { getAuth } from "firebase/auth";

const LandingPage: React.FC = () => {
  const howToRef = useRef<HTMLDivElement | null>(null);
  const meetTheTeamRef = useRef<HTMLDivElement | null>(null);

  const scrollToSegment = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleNavigateToSignIn = () => {
    navigate(`/signin`)
  }

  const handleStartNow = () => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      navigate('/savvycsv/:conversationId?')
    } else {
      navigate('/signin')
    }
  }

  const handleNavigateTeamPage = () => {
    navigate(`/team`)
  }

  const navigate = useNavigate();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainWrapper}>
        <header className={styles.stickyHeader}>
          <div className={styles.leftHeaderGroup}>
            <div className={styles.onyxGroup}>
              OnyxAI LLC
            </div>
            <div className={styles.navButtonGroup}>
              <button onClick={() => scrollToSegment(howToRef)}>How to Use</button>
              <button onClick={handleNavigateTeamPage}>Meet the Team</button>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleNavigateToSignIn}>Sign up</button>
          </div>
        </header>
        <div className={styles.contentContainer}>
          <div className={styles.contentColumn}>
            <Reveal>
              <div className={styles.contentTitle}>
                <span className={styles.accentText}>Real Data</span> in Real Time.
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.contentBody}>Designed to effortlessly create the perfect CSV file.</div>
            </Reveal>
            <Reveal>
              <div className={styles.contentBody}>
                By harnessing the power of web-scraping technologies and Artificial Intelligence, SavvyCSV promises to streamline your data collection process.
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.startButtonContainer}>
                <button onClick={handleStartNow}>
                  Start now
                </button>
              </div>
            </Reveal>
          </div>
          <div className={styles.savvyLogoColumn}>
            <div className={styles.savvyLogo}>
              <SavvyLogo />
            </div>
          </div>
        </div>
        <div className={styles.tutorialContainer} ref={howToRef}>
          <div className={styles.tutorialGifColumn}>
            <Reveal>
              <div className={styles.tutorialGif}>
                <video
                  src={tutorialVideo}
                  autoPlay
                  loop
                  muted
                  controls
                  width="650"
                  height="auto"
                />
              </div>
            </Reveal>
          </div>
          <div className={styles.tutorialContentColumn}>
            <Reveal>
              <div className={styles.tutorialTitle}>
                Endless <span className={styles.accentText}>Datasets</span> at Your Disposal.
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.tutorialBody}>
                Search for any dataset you can imagine by communicating with SavvyBot.
              </div>
            </Reveal>
          </div>
        </div>
        <ProgressBar />
      </div>
    </div>
  );
}

export default LandingPage
