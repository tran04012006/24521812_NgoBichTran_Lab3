
import SkillBadge from "./SkillBadge.jsx";
import ProfileAvatar from "./ProfileAvatar.jsx";
import styles from "./DeveloperCard.module.css";

const developer = {
  name: "Alex Morgan",
  title: "Frontend Engineer & Pro-Gamer",
  description:
    "I love building accessible web applications and competing in esports.",
  location: "Ho Chi Minh City, Vietnam",
  experience: "3 years",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/160?img=47",
  skills: [
    "React 19",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Node.js",
  ],
  gaming: {
    game: "Valorant",
    rank: "Immortal",
    role: "Duelist",
  },
};

function DeveloperCard() {
  return (
    <article
      className={styles.card}
      aria-labelledby="developer-name"
    >
      <header className={styles.header}>
        <ProfileAvatar
          name={developer.name}
          src={developer.avatar}
          size={96}
        />

        <hgroup className={styles.identity}>
          <h2
            id="developer-name"
            className={styles.name}
          >
            {developer.name}
          </h2>

          <p className={styles.title}>
            {developer.title}
          </p>
        </hgroup>
      </header>

      <section
        className={styles.section}
        aria-labelledby="about-heading"
      >
        <h3
          id="about-heading"
          className={styles.sectionTitle}
        >
          About Me
        </h3>

        <p className={styles.description}>
          {developer.description}
        </p>
      </section>

      <section
        className={styles.section}
        aria-labelledby="developer-info-heading"
      >
        <h3
          id="developer-info-heading"
          className={styles.sectionTitle}
        >
          Developer Information
        </h3>

        <dl className={styles.infoList}>
          <dt className={styles.infoLabel}>
            Location
          </dt>
          <dd className={styles.infoValue}>
            {developer.location}
          </dd>

          <dt className={styles.infoLabel}>
            Experience
          </dt>
          <dd className={styles.infoValue}>
            {developer.experience}
          </dd>

          <dt className={styles.infoLabel}>
            Email
          </dt>
          <dd className={styles.infoValue}>
            <a
              className={styles.infoLink}
              href={`mailto:${developer.email}`}
            >
              {developer.email}
            </a>
          </dd>
        </dl>
      </section>

      <section
        className={styles.section}
        aria-labelledby="skills-heading"
      >
        <h3
          id="skills-heading"
          className={styles.sectionTitle}
        >
          Technical Skills
        </h3>

        <ul className={styles.skillList}>
          {developer.skills.map((skill) => (
            <SkillBadge
              key={skill}
              name={skill}
            />
          ))}
        </ul>
      </section>

      <section
        className={styles.section}
        aria-labelledby="gaming-heading"
      >
        <h3
          id="gaming-heading"
          className={styles.sectionTitle}
        >
          Gaming Profile
        </h3>

        <dl className={styles.gamingList}>
          <dt className={styles.gamingLabel}>
            Favorite Game
          </dt>
          <dd className={styles.gamingValue}>
            {developer.gaming.game}
          </dd>

          <dt className={styles.gamingLabel}>
            Rank
          </dt>
          <dd className={styles.gamingValue}>
            {developer.gaming.rank}
          </dd>

          <dt className={styles.gamingLabel}>
            Role
          </dt>
          <dd className={styles.gamingValue}>
            {developer.gaming.role}
          </dd>
        </dl>
      </section>
    </article>
  );
}

export default DeveloperCard;
