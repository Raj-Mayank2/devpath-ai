from langgraph.graph import END, START, StateGraph

from app.ai.nodes import generate_response
from app.ai.state import AIState


def build_ai_graph():
    graph = StateGraph(AIState)

    graph.add_node("generate_response", generate_response)

    graph.add_edge(START, "generate_response")
    graph.add_edge("generate_response", END)

    return graph.compile()


ai_graph = build_ai_graph()