import { useState } from "react";

import {
  getProgress,
  toggleProgress,
} from "../api/progress";

import {
  getResourcesByTopic,
} from "../api/resources";


function TopicItem({
  topic,
  roadmapId,
  completedTopics,
  onProgressChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  const hasChildren =
    topic.children && topic.children.length > 0;

  const isCompleted =
    completedTopics.has(topic.title);


  async function handleToggle() {
    if (updating) {
      return;
    }

    try {
      setUpdating(true);

      const result = await toggleProgress(
        "demo-user",
        roadmapId,
        topic.title
      );

      onProgressChange(result);

    } catch (error) {
      console.error(
        "Failed to update progress:",
        error
      );

    } finally {
      setUpdating(false);
    }
  }


  async function handleExpand() {
    const nextExpanded = !expanded;

    setExpanded(nextExpanded);

    if (
      nextExpanded &&
      !resourcesLoaded
    ) {
      try {
        setResourcesLoading(true);

        const data =
          await getResourcesByTopic(
            topic.title
          );

        setResources(data);
        setResourcesLoaded(true);

      } catch (error) {
        console.error(
          "Failed to load resources:",
          error
        );

      } finally {
        setResourcesLoading(false);
      }
    }
  }


  return (
    <div className="topic">

      <div className="topic-header">

        <div
          className="topic-info"
          onClick={handleExpand}
        >

          {hasChildren && (
            <span className="topic-toggle">
              {expanded ? "−" : "+"}
            </span>
          )}

          <div>

            <h4
              className={
                isCompleted
                  ? "completed-topic"
                  : ""
              }
            >
              {topic.title}
            </h4>

            {topic.description && (
              <p>
                {topic.description}
              </p>
            )}

          </div>

        </div>


        <button
          className={`progress-button ${
            isCompleted
              ? "completed"
              : ""
          }`}
          onClick={handleToggle}
          disabled={updating}
        >
          {updating
            ? "..."
            : isCompleted
            ? "✓ Completed"
            : "Mark Complete"}
        </button>

      </div>


      {expanded && (

        <div className="topic-content">

          {/* Child Topics */}

          {hasChildren && (
            <div className="topic-children">

              {topic.children
                .sort(
                  (a, b) =>
                    a.order - b.order
                )
                .map((child) => (

                  <TopicItem
                    key={`${topic.title}-${child.title}`}
                    topic={child}
                    roadmapId={roadmapId}
                    completedTopics={
                      completedTopics
                    }
                    onProgressChange={
                      onProgressChange
                    }
                  />

                ))}

            </div>
          )}


          {/* Resources */}

          <div className="resources">

            <h5>
              Learning Resources
            </h5>


            {resourcesLoading && (
              <p className="resource-status">
                Loading resources...
              </p>
            )}


            {!resourcesLoading &&
              resources.length === 0 && (
                <p className="resource-status">
                  No resources available yet.
                </p>
              )}


            {!resourcesLoading &&
              resources.length > 0 && (

                <div className="resource-list">

                  {resources.map(
                    (resource) => (

                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="resource-card"
                      >

                        <div className="resource-icon">
                          {getResourceIcon(
                            resource.resource_type
                          )}
                        </div>

                        <div className="resource-info">

                          <strong>
                            {resource.title}
                          </strong>

                          <p>
                            {resource.description}
                          </p>

                          <span>
                            {resource.resource_type}
                          </span>

                        </div>

                      </a>

                    )
                  )}

                </div>

              )}

          </div>

        </div>

      )}

    </div>
  );
}


function getResourceIcon(type) {

  switch (type.toLowerCase()) {

    case "documentation":
      return "📘";

    case "tutorial":
      return "📖";

    case "article":
      return "📝";

    case "video":
      return "🎥";

    case "practice":
      return "💻";

    default:
      return "🔗";
  }
}


function RoadmapCard({ roadmap }) {

  const [completedTopics, setCompletedTopics] =
    useState(new Set());


  /*
   * Load saved progress.
   */

  useState(() => {
    loadProgress();
  });


  async function loadProgress() {

    try {

      const progress =
        await getProgress(
          "demo-user",
          roadmap.id
        );

      const completed =
        new Set(
          progress
            .filter(
              (item) =>
                item.completed
            )
            .map(
              (item) =>
                item.topic_title
            )
        );

      setCompletedTopics(
        completed
      );

    } catch (error) {

      console.error(
        "Failed to load progress:",
        error
      );

    }
  }


  function handleProgressChange(
    progress
  ) {

    setCompletedTopics(
      (previous) => {

        const updated =
          new Set(previous);

        if (
          progress.completed
        ) {

          updated.add(
            progress.topic_title
          );

        } else {

          updated.delete(
            progress.topic_title
          );

        }

        return updated;
      }
    );
  }


  const totalTopics =
    countTopics(
      roadmap.topics
    );


  const completedCount =
    completedTopics.size;


  const progressPercentage =
    totalTopics === 0
      ? 0
      : Math.round(
          (completedCount /
            totalTopics) *
            100
        );


  return (
    <section className="roadmap-card">

      <div className="roadmap-header">

        <div>

          <h2>
            {roadmap.title}
          </h2>

          <p>
            {roadmap.description}
          </p>

        </div>

        <span className="topic-count">
          {totalTopics} topics
        </span>

      </div>


      <div className="progress-section">

        <div className="progress-info">

          <span>
            Learning Progress
          </span>

          <strong>
            {completedCount} / {totalTopics}
          </strong>

        </div>


        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width:
                `${progressPercentage}%`,
            }}
          />

        </div>


        <span className="progress-percentage">
          {progressPercentage}% complete
        </span>

      </div>


      <div className="roadmap-topics">

        {roadmap.topics
          .sort(
            (a, b) =>
              a.order - b.order
          )
          .map((topic) => (

            <TopicItem
              key={topic.title}
              topic={topic}
              roadmapId={roadmap.id}
              completedTopics={
                completedTopics
              }
              onProgressChange={
                handleProgressChange
              }
            />

          ))}

      </div>

    </section>
  );
}


function countTopics(topics) {

  let count = 0;

  for (const topic of topics) {

    count += 1;

    if (topic.children?.length) {

      count += countTopics(
        topic.children
      );

    }
  }

  return count;
}


export default RoadmapCard;