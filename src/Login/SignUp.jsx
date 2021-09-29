import React, { useState } from "react";
import "./login.css";
import RandomQuotes from "./RandomQuotes";
import videoSrc from "./videos/video-2-main.mp4";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import imgSrc from "./images/img-2.png";
import { userDataSlice } from "../Store/userDataSlice";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "../GlobalCommonData";
import { Container, Row, Col } from "react-bootstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function SignUp() {
  const history = useHistory();
  const dispatch = useDispatch();
  let [availableSpinnerFlag, setFlag] = useState(false);
  let [connectionMadeFlag, setConnectionMadeFlag] = useState(false);
  let [userNameAvailableFlag, setNameAvailableFlag] = useState(false);
  let [skillOverflowFlag, setSkillOverflowFlag] = useState(false);
  let [skillUnderflowFlag, setSkillUnderflowFlag] = useState(false);
  let [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [spinnerFlag, setSpinnerFlag] = useState(false);
  const [errMsg, setErrorMsg] = useState("");

  let [curSkill, setSkill] = useState("");
  let [userData, setUserData] = useState({
    email: "",
    password: "",
    userName: "",
    github: "",
    linkedIn: "",
    currentCompany: "",
    designation: "",
    skills: [],
  });
  const reset = () => {
    setFlag(false);
    setAlreadyRegistered(false);
    setSkillUnderflowFlag(false);
    setSkillOverflowFlag(false);
    setNameAvailableFlag(false);
    setConnectionMadeFlag(false);
  };
  const marginAutoCSS = {
    margin: "auto",
  };
  const displayFlexCSS = {
    display: "flex",
    flexDirection: "row",
  };
  const signUpHandler = (evt) => {
    evt.preventDefault();
    if (userData.skills.length > 0) {
      setSpinnerFlag(true);
      fetch(`${SERVER_URL}signUp`, {
        method: "POST",
        body: JSON.stringify({
          userName: userData.userName,
          userEmail: userData.email,
          gitHubLink: userData.github,
          linkedInLink: userData.linkedIn,
          company: userData.currentCompany,
          designation: userData.designation,
          skills: userData.skills,
          password: userData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.alreadyRegistered) {
            console.log("Signed Up..", res.newUser.postsLiked);
            const payload = {
              userId: res.newUser._id,
              userName: res.newUser.userName,
              userEmail: res.newUser.userEmail,
              postsLiked: res.newUser.postsLiked,
              gitHubLink: res.newUser.gitHubLink,
              linkedInLink: res.newUser.linkedInLink,
              company: res.newUser.company,
              designation: res.newUser.designation,
              skills: res.newUser.skills,
              followers: res.newUser.followers,
              following: res.newUser.following,
              posts: res.newUser.posts,
            };
            dispatch(userDataSlice.actions.addUserData(payload));
            history.push("/");
            setSpinnerFlag(false);
            // setUserEmail(userEmail);
          } else {
            //history.push("/");
            setAlreadyRegistered(true);
            setSpinnerFlag(false);
            setErrorMsg(res.errorMsg)
            console.log("No able to sign in", res.errorMsg);
          }
        });
    } else {
      setSkillUnderflowFlag(true);
    }
  };
  const handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();
      if (evt.target.value.trim() && userData.skills.length < 4) {
        setSkill("");
        const curUser = { ...userData };
        curUser.skills = [...curUser.skills, evt.target.value];
        setUserData(curUser);
      } else {
        setSkillOverflowFlag(true);
      }
    }
  };
  const handleDelete = (item) => {
    const newSkillArr = userData.skills.filter((i) => i !== item);
    const curUser = { ...userData };
    curUser.skills = newSkillArr;
    setUserData(curUser);
  };
  const checkIfUserNamExists = () => {
    if (userData.userName.trim()) {
      setFlag(true);
      fetch(`${SERVER_URL}checkUserName`, {
        method: "POST",
        body: JSON.stringify({ userName: userData.userName }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          setFlag(false);
          setConnectionMadeFlag(true);
          if (res.isAvailable) {
            setNameAvailableFlag(true);
            console.log("Available");
            // setUserEmail(userEmail);
          } else {
            //history.push("/home/1")
            setNameAvailableFlag(false);
            console.log("Not Available");
          }
        });
    }
  };
  return (
    <div className="base-container">
      <video src={videoSrc} autoPlay loop />
      <Container fluid>
        <Row>
          <Col>
            <br />
            <div className="loginBox">
              <p className="heading-tag">ConnectIN</p>
              <div className="form-group">
                <Form onSubmit={signUpHandler}>
                  <FormGroup>
                    <Label for="email" className="labelClass">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        curUser.email = evt.target.value;
                        setUserData(curUser);
                        reset();
                      }}
                      required
                      invalid={alreadyRegistered}
                    />
                    <FormFeedback>
                      {errMsg}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password" className="labelClass">
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        curUser.password = evt.target.value;
                        setUserData(curUser);
                        reset();
                      }}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="username" className="labelClass">
                      User Name
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      placeholder="User Name"
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        curUser.userName = evt.target.value;
                        setUserData(curUser);
                        reset();
                      }}
                      required
                      valid={userNameAvailableFlag && connectionMadeFlag}
                      invalid={!userNameAvailableFlag && connectionMadeFlag}
                    />
                    <FormFeedback valid>
                      Sweet! that username is available
                    </FormFeedback>
                    <FormFeedback>
                      Oh noes! that name is already taken
                    </FormFeedback>
                    <div style={displayFlexCSS}>
                      <Button
                        className="checkBtn"
                        color="link"
                        size="sm"
                        onClick={checkIfUserNamExists}
                      >
                        Check availablity
                      </Button>
                      <div style={marginAutoCSS}>
                        {availableSpinnerFlag && (
                          <Spinner
                            animation="border"
                            role="status"
                            size="sm"
                            variant="primary"
                          >
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                        )}
                      </div>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="linkedIn" className="labelClass">
                      Linked In Profile
                    </Label>
                    <Input
                      type="text"
                      name="linkedIn"
                      placeholder="Linked In Profile"
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        curUser.linkedIn = evt.target.value;
                        setUserData(curUser);
                        reset();
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="company" className="labelClass">
                      Current Company
                    </Label>
                    <Input
                      type="text"
                      name="company"
                      placeholder="Current Company"
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        curUser.currentCompany = evt.target.value;
                        setUserData(curUser);
                        reset();
                      }}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="Designation" className="labelClass">
                      Designation
                    </Label>
                    <Input
                      type="text"
                      name="Designation"
                      id="designation"
                      placeholder="Designation at your current company"
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        curUser.designation = evt.target.value;
                        setUserData(curUser);
                        reset();
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="skills/password" className="labelClass">
                      Skills/Interests
                    </Label>
                    <div style={displayFlexCSS}>
                      {userData.skills.map((item) => (
                        <div className="tag-item" key={item}>
                          {item}
                          <button
                            type="button"
                            className="button"
                            onClick={() => handleDelete(item)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <Input
                      type="text"
                      name="skills/password"
                      placeholder="Things that you are passionate about.."
                      onChange={(evt) => {
                        const curUser = { ...userData };
                        setUserData(curUser);
                        setSkill(evt.target.value);
                        reset();
                      }}
                      value={curSkill}
                      onKeyDown={handleKeyDown}
                      invalid={skillOverflowFlag || skillUnderflowFlag}
                    />
                    {skillUnderflowFlag && (
                      <FormFeedback>
                        Dont shy away from sharing some of your skills with us!
                      </FormFeedback>
                    )}
                    {skillOverflowFlag && (
                      <FormFeedback>
                        Overwheling Curiosity! Not more than 4 are allowed!
                      </FormFeedback>
                    )}
                  </FormGroup>
                  <div className="form-group">
                    <Button color="primary">Sign Up</Button>
                    {spinnerFlag && (
                      <div>
                        <br/>
                        <div style={{ textAlign: "center" }}>
                          <Loader
                            type="Oval"
                            color="grey"
                            height={50}
                            width={50}
                          />
                        </div>
                        <p style={{ color: "white", textAlign: "center" }}>
                          Signing UP
                        </p>
                      </div>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </Col>
          <Col className="quote-class">
            <RandomQuotes />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUp;
