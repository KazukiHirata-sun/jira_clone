import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  fetchAsyncCreateCategory,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";
import { initialState } from "./taskSlice";

const useStyles = makeStyles((theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
  addIcon: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TaskForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const isDisabled =
    editedTask.task.length === 0 ||
    editedTask.description.length === 0 ||
    editedTask.criteria.length === 0;

  const isCatDisabled = inputText.length === 0;

  const handleInputTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value }));
  };

  const handleSelectRespChange = (e) => {
    const value = e.target.value;
    dispatch(editTask({ ...editedTask, responsible: value }));
  };
  const handleSelectStatusChange = (e) => {
    const value = e.target.value;
    dispatch(editTask({ ...editedTask, status: value }));
  };
  const handleSelectCatChange = (e) => {
    const value = e.target.value;
    dispatch(editTask({ ...editedTask, category: value }));
  };
  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));
  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));
  return (
    <div>
      <h2>{editedTask.id ? "Update Task" : "New Task"}</h2>
      <form>
        <TextField
          className={classes.field}
          label="Estimate [days]"
          type="number"
          name="estimate"
          InputProps={{ inputProps: { min: 0, max: 1000 } }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Task"
          type="text"
          name="task"
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Description"
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Criteria"
          type="text"
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        <FormControl className={classes.field}>
          <InputLabel>Responsible</InputLabel>
          <Select
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        <FormControl className={classes.field}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={editedTask.status}
            onChange={handleSelectStatusChange}
          >
            <MenuItem value={1}>Not started</MenuItem>
            <MenuItem value={2}>On going</MenuItem>
            <MenuItem value={3}>Done</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl className={classes.field}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={editedTask.category}
            onChange={handleSelectCatChange}
          >
            {catOptions}
          </Select>
        </FormControl>

        <Fab
          size="small"
          color="primary"
          onClick={handleOpen}
          className={classes.addIcon}
        >
          <AddIcon />
        </Fab>

        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="New category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.saveModal}
              startIcon={<SaveIcon />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              SAVE
            </Button>
          </div>
        </Modal>
        <br />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "Update" : "Save"}
        </Button>

        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;