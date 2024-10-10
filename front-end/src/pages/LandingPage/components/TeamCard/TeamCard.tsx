import React from 'react';
import Reveal from '../Reveal/Reveal';
import styles from './TeamCard.module.css'

interface TeamCardProps {
    imageUrl: string,
    name: string,
    title: string,
}

const TeamCard: React.FC<TeamCardProps> = ({ imageUrl, name, title }) => {
    const [ firstName, lastName = '' ] = name.trim().split(' ');

    return (
        <div className={styles.cardContainer}>
            <Reveal>
                <div className={styles.teamMemberImage}>
                    <img src={imageUrl} />
                </div>
            </Reveal>
            <div className={styles.teamMemberInfo}>
                <Reveal>
                    <div className={styles.teamMemberName}>
                        <span className={styles.accentText}>{firstName}</span> {lastName}
                    </div>
                </Reveal>
                <Reveal>
                    <div className={styles.teamMemberTitle}>
                        {title}
                    </div>
                </Reveal>
            </div>
        </div>
    );
}

export default TeamCard