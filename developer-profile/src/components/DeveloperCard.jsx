
import SkillBadge from "./SkillBadge.jsx";

const developer = {
  name: "Alex Morgan",
  title: "Frontend Engineer & Pro-Gamer",
  description:
    "I love building accessible web applications and competing in esports.",
  location: "Ho Chi Minh City, Vietnam",
  experience: "3 years",
  email: "alex@example.com",

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
      className="developer-card"
      aria-labelledby="developer-name"
    >
      <header className="developer-header">
        <hgroup>
          <h2 id="developer-name">
            {developer.name}
          </h2>

          <p>{developer.title}</p>
        </hgroup>
      </header>

      <section aria-labelledby="about-heading">
        <h3 id="about-heading">About Me</h3>

        <p>{developer.description}</p>
      </section>

      <section aria-labelledby="developer-info-heading">
        <h3 id="developer-info-heading">
          Developer Information
        </h3>

        <dl>
          <dt>Location</dt>
          <dd>{developer.location}</dd>

          <dt>Experience</dt>
          <dd>{developer.experience}</dd>

          <dt>Email</dt>
          <dd>
            <a href={`mailto:${developer.email}`}>
              {developer.email}
            </a>
          </dd>
        </dl>
      </section>

      <section aria-labelledby="skills-heading">
        <h3 id="skills-heading">
          Technical Skills
        </h3>

        <ul className="skill-list">
          {developer.skills.map((skill) => (
            <SkillBadge
              key={skill}
              name={skill}
            />
          ))}
        </ul>
      </section>

      <section aria-labelledby="gaming-heading">
        <h3 id="gaming-heading">
          Gaming Profile
        </h3>

        <dl>
          <dt>Favorite Game</dt>
          <dd>{developer.gaming.game}</dd>

          <dt>Rank</dt>
          <dd>{developer.gaming.rank}</dd>

          <dt>Role</dt>
          <dd>{developer.gaming.role}</dd>
        </dl>
      </section>
    </article>
  );
}

export default DeveloperCard;
