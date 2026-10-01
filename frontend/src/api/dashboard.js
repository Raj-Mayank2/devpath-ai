const API_URL="http://127.0.0.1:8000/api/v1";

export async function getDashboardStats(){
    const token=
    localStorage.getItem("access_token");

    const response=await fetch(
        `${API_URL}/dashboard/stats`,
        {
            headers:{
                Authorization: `Bearer ${token}`,

            },
        }
    );

    if(!response.ok){
        throw new Error(
            "Failed to fetch dashboard statistics"
        )
    }

    return response.json();
}