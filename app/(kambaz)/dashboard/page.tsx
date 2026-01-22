import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/courses/4353" className="wd-dashboard-course-link">
            <Image src="/images/python.jpg" width={200} height={150} alt="python" />
            <div>
                <h5> CS4363 Python</h5>
                <p className="wd-dashboard-course-title">
                    Intro to Programming
                    </p>
                    <button> Go </button></div></Link> </div>
        <div className="wd-dashboard-course"> 
            <Link href="/courses/4550" className="wd-dashboard-course-link">
            <Image src="/images/java.jpg" width={200} height={150} alt="java" />
            <div>
                <h5> CS4363 Java</h5>
                <p className="wd-dashboard-course-title">
                    Intro to Object Oriented Design
                    </p>
                    <button> Go </button></div></Link> </div>
                <div className="wd-dashboard-course"> 
            <Link href="/courses/3888" className="wd-dashboard-course-link">
            <Image src="/images/nodejs.jpg" width={200} height={150} alt="nodejs" />
            <div>
                <h5> CS3888 Node JS</h5>
                <p className="wd-dashboard-course-title">
                    Node JS design fundamentals
                    </p>
                    <button> Go </button></div></Link> </div>
                    <div className="wd-dashboard-course"> 
            <Link href="/courses/4000" className="wd-dashboard-course-link">
            <Image src="/images/sql.jpg" width={200} height={150} alt="sql" />
            <div>
                <h5> CS4000 SQL</h5>
                <p className="wd-dashboard-course-title">
                    Databases and Design
                    </p>
                    <button> Go </button></div></Link> </div>
                    <div className="wd-dashboard-course"> 
            <Link href="/courses/3000" className="wd-dashboard-course-link">
            <Image src="/images/tailwind.jpg" width={200} height={150} alt="tailwind" />
            <div>
                <h5> CS3000 Tailwind</h5>
                <p className="wd-dashboard-course-title">
                    Intro to Frontend Design
                    </p>
                    <button> Go </button></div></Link> </div>
                    <div className="wd-dashboard-course"> 
            <Link href="/courses/7002" className="wd-dashboard-course-link">
            <Image src="/images/rust.jpg" width={200} height={150} alt="rust" />
            <div>
                <h5> CS7002 Rust</h5>
                <p className="wd-dashboard-course-title">
                    Intro to General Systems Programming
                    </p>
                    <button> Go </button></div></Link> </div>
      </div>
    </div>
);}
