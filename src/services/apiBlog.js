import api from "@/api"

export async function getBlogs(page){
    try {
        const response = await api.get(`blog_list?page=${page}`)
        return response.data
    } catch (err) {
        console.error('Error fetching blogs:', err)
        throw new Error(err.message)
    }
}

export async function getBlog(slug) {
    try {
        const response = await api.get(`blogs/${slug}`)
        return response.data
    } catch (err) {
        
        throw new Error(err.message)
    }    
}

export async function registerUser(data) {
    try {
        const response = await api.post("register_user/", data)
        return response.data
    } catch (err) {
        console.log('Error registering user:', err)
        if(err.response?.status === 400) {
            // Extract the actual error message from the response
            const errorMessage = err.response?.data?.username?.[0] 
                || err.response?.data?.message 
                || "El usuario ya existe"
            throw new Error(errorMessage)
        }
        
        // Properly handle other errors
        throw new Error(err.response?.data?.message || err.message || "Intente nuevamente")
    }
}


export async function signin(data) {
    try {
        const response = await api.post("token/", data)
        return response.data
    } catch (err) {
        if(err.status === 401) {
            throw new Error("Credencial invalido")
        }

        throw new Error(err)
    }    
}

export async function getUsername() {
  try {
    const response = await api.get("get_username");
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function createBlog(data) {
    try {
      const response = await api.post("create_blog/", data);
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
}

export async function updateBlog(data, id) {
    try {
      const response = await api.put(`update_blog/${id}/`, data);
      return response.data;
    } catch (err) {
      if (err.response) {
        throw new Error(err.response?.data?.message || "Fallo la actualización");
      }
  
      throw new Error(err.message);
    }
}

export async function deleteBlog(id) {
    try {
      const response = await api.post(`delete_blog/${id}/`);
      return response.data;
    } catch (err) {
      if (err.response) {
        throw new Error(err.response?.data?.message || "Intente nuevamente");
      }
  
      throw new Error(err.message);
    }
  }

  export async function getUserInfo(username) {
    try {
      const response = await api.get(`get_userinfo/${username}`);
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  export async function updateProfile(data) {
    try {
      const response = await api.put(`update_user/`, data);
      return response.data;
    } catch (err) {
      console.log(err)
      if (err.response) {
        throw new Error(
          err?.response?.data.username[0] || "Fallo la actualización de perfil"
        );
      }
  
      throw new Error(err.message);
    }
  }


