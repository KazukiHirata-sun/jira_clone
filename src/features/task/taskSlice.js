import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});

export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      { item: item },
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task) => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);


export const initialState = {
  tasks: [
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      owner: 0,
      owner_username: "",
      responsible: 0,
      responsible_username: "",
      estimate: 0,
      category: 0,
      category_item: "",
      status: "",
      status_name: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    responsible: 0,
    estimate: 0,
    category: 0,
    status: "",
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    owner: 0,
    owner_username: "",
    responsible: 0,
    responsible_username: "",
    estimate: 0,
    category: 0,
    category_item: "",
    status: "",
    status_name: "",
    created_at: "",
    updated_at: "",
  },
  users: [
    {
      id: 0,
      username: "",
    },
  ],
  category: [
    {
      id: 0,
      item: "",
    },
  ],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    editTask(state, action) {
      state.editedTask = action.payload;
    },
    selectTask(state, action) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      (state, action) => {
        return {
          ...state,
          tasks: action.payload,
        };
      }
    );
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncGetUsers.fulfilled,
      (state, action) => {
        return {
          ...state,
          users: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      (state, action) => {
        return {
          ...state,
          category: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      (state, action) => {
        return {
          ...state,
          category: [...state.category, action.payload],
        };
      }
    );
    builder.addCase(fetchAsyncCreateCategory.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      (state, action) => {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          editedTask: initialState.editedTask,
        };
      }
    );
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      (state, action) => {
        return {
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          ),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    );
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      (state, action) => {
        return {
          ...state,
          tasks: state.tasks.filter((t) => t.id !== action.payload),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    );
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      window.location.href = "/";
    });
  },
});

export const { editTask, selectTask } = taskSlice.actions;
export const selectSelectedTask = (state) => state.task.selectedTask;
export const selectEditedTask = (state) => state.task.editedTask;
export const selectTasks = (state) => state.task.tasks;
export const selectUsers = (state) => state.task.users;
export const selectCategory = (state) => state.task.category;

export default taskSlice.reducer;