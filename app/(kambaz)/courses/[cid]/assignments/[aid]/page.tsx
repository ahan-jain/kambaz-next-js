export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
        your Web application running on Netlify. The landing page should include
        the following: Your full name and section Links to each of the lab
        assignments Link to the Kanbas application Links to all relevant source
        code repositories The Kanbas application should include a link to
        navigate back to the landing page.
      </textarea>
      <table>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assignment-groups">Assignment Groups</label>
          </td>
          <td>
            <select defaultValue="ASSIGNMENTS" id="wd-groups">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
            </select>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-grade">Display Grade as</label>
          </td>
          <td>
            <select defaultValue="Percentage" id="wd-score">
              <option value="Percentage">Percentage</option>
              <option value="Points">Points</option>
            </select>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission">Submission Type</label>
          </td>
          <td>
            <select defaultValue="Online" id="wd-submission">
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <br /> <br />
            <label htmlFor="wd-entry-options">Online Entry Options</label>
            <br />
            <input
              type="checkbox"
              name="check-text-entry"
              id="wd-chkbox-text-entry"
            />
            <label htmlFor="wd-chkbox-text-entry">Text Entry</label>
            <br />
            <input type="checkbox" name="check-url" id="wd-chkbox-url" />
            <label htmlFor="wd-chkbox-url">Website URL</label>
            <br />
            <input
              type="checkbox"
              name="check-media"
              id="wd-chkbox-recordings"
            />
            <label htmlFor="wd-chkbox-recordings">Media Recordings</label>
            <br />
            <input
              type="checkbox"
              name="check-annotations"
              id="wd-chkbox-annotations"
            />
            <label htmlFor="wd-chkbox-annotations">Student Annotations</label>
            <br />
            <input
              type="checkbox"
              name="check-uploads"
              id="wd-chkbox-uploads"
            />
            <label htmlFor="wd-chkbox-uploads">File Uploads</label>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assign">Assign</label>
          </td>
          <td>
            <label htmlFor="wd-to">Assign to</label>
            <br />
            <input id="wd-assignval" defaultValue="Everyone" />
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top"></td>
          <td>
            <label htmlFor="wd-due">Due</label>
            <br />
            <input defaultValue="2024-05-13" type="date" id="wd-due-date" />
            <br />
            <br />

            <table>
              <tr>
                <td>
                  <label htmlFor="wd-available-from">Available from</label>
                </td>
                <td>
                  <label htmlFor="wd-available-until">Until</label>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="date"
                    id="wd-available-from"
                    defaultValue="2024-05-06"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    id="wd-available-until"
                    defaultValue="2024-05-20"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <hr />
      <button>Cancel</button>
      <button>Save</button>
    </div>
  );
}
