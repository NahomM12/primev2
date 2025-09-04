// src/store/darkMode/darkModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: localStorage.getItem("theme") === "dark",
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
