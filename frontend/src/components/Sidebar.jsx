function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h3>School MS</h3>
      <hr />

      <p>🏠 Dashboard</p>
      <p>👨‍🎓 Students</p>
      <p>👨‍🏫 Teachers</p>
      <p>📚 Subjects</p>
      <p>🚪 Logout</p>
    </div>
  );
}

export default Sidebar;