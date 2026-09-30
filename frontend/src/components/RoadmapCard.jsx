import { useState } from "react";

function TopicItem({ topic }) {
  const [expanded, setExpanded] = useState(false);

  const hasChildren = topic.children && topic.children.length > 0;

  return (
    <div className="topic">
      <div
        className={`topic-header ${hasChildren ? "clickable" : ""}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div>
          <h4>{topic.title}</h4>

          {topic.description && (
            <p>{topic.description}</p>
          )}
        </div>

        {hasChildren && (
          <span className="topic-toggle">
            {expanded ? "−" : "+"}
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="topic-children">
          {topic.children.map((child) => (
            <TopicItem
              key={`${topic.title}-${child.title}`}
              topic={child}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function RoadmapCard({ roadmap }) {
  return (
    <section className="roadmap-card">

      <div className="roadmap-header">
        <div>
          <h2>{roadmap.title}</h2>
          <p>{roadmap.description}</p>
        </div>

        <span className="topic-count">
          {roadmap.topics.length} sections
        </span>
      </div>

      <div className="roadmap-topics">
        {roadmap.topics
          .sort((a, b) => a.order - b.order)
          .map((topic) => (
            <TopicItem
              key={topic.title}
              topic={topic}
            />
          ))}
      </div>

    </section>
  );
}

export default RoadmapCard;