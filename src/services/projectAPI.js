import axios from 'axios'


export async function onProjectCreate(body) {
    try {
        return axios.post("/v1/project/createproject", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


export async function onGetAllProject(dispatch) {
    try {
        return axios.get(`/v1/project/getAllProject`, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}