import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { motion } from "motion/react";

import RoadmapNode from "./RoadmapNode";
import TopicPanel from "./TopicPanel";
import { getProgress, toggleProgress } from "../../api/progress";


const nodeTypes = {
  roadmapNode: RoadmapNode,
};


/* Layout constants */

const COLUMN_WIDTH = 340;
const ROW_HEIGHT = 150;
const SECTION_GAP = 100;
const PAD_X = 48;
const PAD_TOP = 80;
const NODE_WIDTH = 260;


/* Edge colours */

const DONE = "#10b981";
const TODO = "#cbd5e1";


/* Circular progress indicator */

function ProgressRing({ percentage, size = 76, stroke = 7 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-100"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={percentage === 100 ? DONE : "#4f46e5"}
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset:
              circumference * (1 - percentage / 100),
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-slate-900">
        {percentage}%
      </span>
    </div>
  );
}


function RoadmapCanvas({
  roadmap,
  onProgressChange,
  onTopicSelect,
}) {
  const [completedTopics, setCompletedTopics] = useState(
    new Set()
  );

  const [selectedTopic, setSelectedTopic] = useState(null);

  const [updating, setUpdating] = useState(false);


  /* Load progress */

  useEffect(() => {
    async function loadProgress() {
      try {
        const progress = await getProgress(roadmap.id);

        setCompletedTopics(
          new Set(
            progress
              .filter((item) => item.completed)
              .map((item) => item.topic_title)
          )
        );
      } catch (error) {
        console.error(
          "Failed to load progress:",
          error
        );
      }
    }

    loadProgress();
  }, [roadmap.id]);


  /* Select topic */

  const handleTopicSelect = useCallback(
    (topic) => {
      setSelectedTopic(topic);

      if (onTopicSelect) {
        onTopicSelect(topic);
      }
    },
    [onTopicSelect]
  );


  /* Toggle topic */

  async function handleToggleTopic() {
    if (!selectedTopic || updating) return;

    try {
      setUpdating(true);

      const result = await toggleProgress(
        roadmap.id,
        selectedTopic.title
      );

      setCompletedTopics((previous) => {
        const updated = new Set(previous);

        if (result.completed) {
          updated.add(result.topic_title);
        } else {
          updated.delete(result.topic_title);
        }

        return updated;
      });

      setSelectedTopic((previous) =>
        previous
          ? {
              ...previous,
              completed: result.completed,
            }
          : previous
      );

      if (onProgressChange) {
        onProgressChange(result);
      }
    } catch (error) {
      console.error(
        "Failed to update progress:",
        error
      );
    } finally {
      setUpdating(false);
    }
  }


  /* Build graph */

  const {
    nodes: initialNodes,
    edges: initialEdges,
    roadmapHeight,
    roadmapWidth,
  } = useMemo(() => {
    const nodes = [];
    const edges = [];

    let currentY = PAD_TOP;
    let maxDepth = 0;

    const createNodeId = (path) =>
      `topic-${path.join("-")}`;


    function buildTopic(
      topic,
      depth,
      parentId,
      path
    ) {
      maxDepth = Math.max(
        maxDepth,
        depth
      );

      const children = [
        ...(topic.children || []),
      ].sort(
        (a, b) => a.order - b.order
      );

      const nodeId =
        createNodeId(path);

      const isDone =
        completedTopics.has(
          topic.title
        );

      let nodeY;


      if (children.length === 0) {
        nodeY = currentY;
        currentY += ROW_HEIGHT;
      } else {
        const childYs =
          children.map(
            (child, index) =>
              buildTopic(
                child,
                depth + 1,
                nodeId,
                [...path, index]
              ).y
          );

        nodeY =
          (childYs[0] +
            childYs[
              childYs.length - 1
            ]) /
          2;
      }


      nodes.push({
        id: nodeId,
        type: "roadmapNode",
        position: {
          x:
            PAD_X +
            depth * COLUMN_WIDTH,
          y: nodeY,
        },
        data: {
          title: topic.title,
          description:
            topic.description || "",
          completed: isDone,
          hasChildren:
            children.length > 0,
          depth,
          onSelect:
            handleTopicSelect,
        },
      });


      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: !isDone,
          style: {
            stroke: isDone
              ? DONE
              : TODO,
            strokeWidth: isDone
              ? 2.5
              : 2,
            strokeDasharray:
              isDone
                ? undefined
                : "6 6",
          },
        });
      }


      return {
        id: nodeId,
        y: nodeY,
      };
    }


    [...(roadmap.topics || [])]
      .sort(
        (a, b) => a.order - b.order
      )
      .forEach(
        (topic, index) => {
          buildTopic(
            topic,
            0,
            null,
            [index]
          );

          currentY += SECTION_GAP;
        }
      );


    return {
      nodes,
      edges,
      roadmapHeight:
        Math.max(
          850,
          currentY + 120
        ),
      roadmapWidth:
        PAD_X * 2 +
        maxDepth * COLUMN_WIDTH +
        NODE_WIDTH,
    };
  }, [
    roadmap,
    completedTopics,
    handleTopicSelect,
  ]);


  /* React Flow state */

  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState(initialNodes);

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);


  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [
    initialNodes,
    initialEdges,
    setNodes,
    setEdges,
  ]);


  /* Progress numbers */

  const totalTopics =
    countTopics(
      roadmap.topics || []
    );

  const completedCount =
    completedTopics.size;

  const remaining = Math.max(
    totalTopics -
      completedCount,
    0
  );

  const percentage =
    totalTopics === 0
      ? 0
      : Math.round(
          (completedCount /
            totalTopics) *
            100
        );


  const statusLine =
    totalTopics === 0
      ? "No topics yet."
      : percentage === 100
      ? "Roadmap complete. Nicely done."
      : completedCount === 0
      ? "Select a topic to start learning."
      : `${remaining} ${
          remaining === 1
            ? "topic"
            : "topics"
        } left to go.`;


  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">

      {/* Header */}

      <header className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-indigo-50 via-white to-emerald-50/60 px-5 py-6 sm:px-8">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              Learning roadmap
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {roadmap.title}
            </h2>

            {roadmap.description && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                {roadmap.description}
              </p>
            )}

          </div>


          <div className="flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur">

            <ProgressRing
              percentage={percentage}
            />

            <div>
              <p className="text-2xl font-bold leading-none text-slate-900">
                {completedCount}

                <span className="text-base font-medium text-slate-400">
                  {" "}
                  / {totalTopics}
                </span>
              </p>

              <p className="mt-1 text-sm font-medium text-slate-600">
                topics completed
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {statusLine}
              </p>
            </div>

          </div>

        </div>
      </header>


      {/* Roadmap */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
        }}
        className="relative bg-gradient-to-b from-slate-50 to-white"
      >

        {/* Roadmap */}

        <div className="overflow-x-auto">

          <div
            className="relative mx-auto"
            style={{
              height: `${roadmapHeight}px`,
              width: `${roadmapWidth}px`,
            }}
          >

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={
                onNodesChange
              }
              onEdgesChange={
                onEdgesChange
              }
              nodeTypes={nodeTypes}
              defaultViewport={{
                x: 0,
                y: 0,
                zoom: 1,
              }}
              minZoom={1}
              maxZoom={1}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnDrag={false}
              panOnScroll={false}
              preventScrolling={false}
              proOptions={{
                hideAttribution: true,
              }}
            >

              <Background
                variant={
                  BackgroundVariant.Dots
                }
                gap={26}
                size={1.4}
                color="#cbd5e1"
              />


              <Panel position="bottom-left">

                <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-medium text-slate-600 shadow-md backdrop-blur">

                  <span className="flex items-center gap-2">
                    <span className="h-0.5 w-5 rounded bg-emerald-500" />
                    Completed
                  </span>

                  <span className="flex items-center gap-2">

                    <span
                      className="h-0 w-5 border-t-2 border-dashed border-slate-300"
                      aria-hidden="true"
                    />

                    To do
                  </span>

                </div>

              </Panel>

            </ReactFlow>

          </div>

        </div>


        {/* Topic panel */}

        {selectedTopic && (
          <TopicPanel
            topic={selectedTopic}
            updating={updating}
            onClose={() =>
              setSelectedTopic(null)
            }
            onToggle={
              handleToggleTopic
            }
          />
        )}

      </motion.div>

    </section>
  );
}


/* Count all topics */

function countTopics(topics) {
  let count = 0;

  for (const topic of topics) {
    count += 1;

    if (
      topic.children &&
      topic.children.length > 0
    ) {
      count += countTopics(
        topic.children
      );
    }
  }

  return count;
}


export default RoadmapCanvas;