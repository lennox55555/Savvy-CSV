import React, { useRef } from "react";
import styles from './TeamPage.module.css'
import lennoxProfileImg from '../../assets/lennoxProfileImg.jpeg'
import jonahProfileImg from '../../assets/jonahProfileImg.jpeg'
import williamProfileImg from '../../assets/williamProfileImg.jpeg'
import davidProfileImg from '../../assets/davidProfileImg.jpeg'
import Reveal from "../LandingPage/components/Reveal/Reveal";
import TeamCard from "../LandingPage/components/TeamCard/TeamCard";
import { useNavigate } from "react-router-dom";

const TeamPage: React.FC = () => {

    const navigate = useNavigate();

    const nagivateHowToUse = () => {
        navigate('/')
    }

    const handleNavigateToSignIn = () => {
        navigate(`/signin`)
    }

    return (
        <div className={styles.mainContainer}>
            <header className={styles.stickyHeader}>
                <div className={styles.leftHeaderGroup}>
                    <div className={styles.onyxGroup}>
                        OnyxAI LLC
                    </div>
                    <div className={styles.navButtonGroup}>
                        <button onClick={nagivateHowToUse}>How to Use</button>
                        <button >Meet the Team</button>
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={handleNavigateToSignIn}>Sign up</button>
                </div>
            </header>
            <div className={styles.contentContainer}>
                <div className={styles.teamTitleRow}>Meet the Team</div>
                <div className={styles.teamContainer}>
                    <div className={styles.teamMembersWrapper}>
                        <TeamCard
                            imageUrl={lennoxProfileImg}
                            name='Lennox Anderson'
                            title='Founder & Chief Engineer'
                        />
                        <TeamCard
                            imageUrl={davidProfileImg}
                            name='David Bosse'
                            title='Project Manager & CO-Founder'
                        />
                        <TeamCard
                            imageUrl={jonahProfileImg}
                            name='Jonah Mulcrone'
                            title='Software Engineer'
                        />
                        <TeamCard
                            imageUrl={williamProfileImg}
                            name='William Guanci'
                            title='Researcher & CO-Founder'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamPage