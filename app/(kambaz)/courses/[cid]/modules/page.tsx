export default function Modules() {
  return (
    <div>
      <button>Collapse All</button>
      <button>View Progress</button>
      <select defaultValue="Publish All" id="wd-publish">
        <option value="Publish All">Publish All</option>
        <option value="Publish Selected">Publish Selected</option>
      </select>{" "}
      <button>+ Module</button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">
            Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
          </div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-learning">LEARNING OBJECTIVES</span>
              <ul className="wd-learn">
                <li className="wd-learning-item">Introduction to the course</li>
                <li className="wd-learning-item">
                  Learn what is Web Development
                </li>
              </ul>
            </li>
            <li>
              <span className="wd-reading">READING</span>
              <ul className="wd-reading">
                <li className="wd-reading-item">
                  Full Stack Developer - Chapter 1 - Introduction
                </li>
                <li className="wd-reading-item">
                  Full Stack Developer - Chapter 2 - Creating User
                </li>
              </ul>
            </li>
            <li>
              <span className="wd-slide">SLIDES</span>
              <ul className="wd-slides">
                <li className="wd-slides-item">
                  Introduction to Web Development
                </li>
                <li className="wd-slides-item">
                  Creating an HTTP Server with Node.js
                </li>
                <li className="wd-slides-item">Creating a React Application</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 1, Lecture 2 - Formatting User Interfaces with HTML</div>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 3</div>
        </li>
      </ul>
    </div>
  );
}
