import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import domain from "../common/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/New.css";
import "./css/Fonts.css";

export default function New() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState();
    const [username, setUsername] = useState();
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [postFormError, setPostFormError] = useState();
    const [postFormIsError, setPostFormIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [form, setForm] = useState(
        [
            {
                question: null,
                description: null,
                type: "text",
            }
        ]
    );

    useEffect(() => {
        async function dashboard() {
            if (localStorage.getItem("token")) {
                await fetch(domain + "/api/new", {
                    headers: { "x-access-token": localStorage.getItem("token") },
                    method: "GET"
                })
                    .then(response => response.json())
                    .then((jsonData) => {
                        console.log(jsonData);
                        if (jsonData.status === "ok") {
                            setUsername(jsonData.username);
                        } else {
                            setErrorMessage(jsonData.message);
                        }
                    });
            } else {
                // token not available
                setErrorMessage("JWT not available. Please try logging in first.");
            }
        }
        dashboard();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch(domain + "/api/new", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                formAuthorUsername: username,
                formTitle,
                formDescription,
                formQuestions: form
            }),
            method: "POST"
        })
            .then(response => response.json())
            .then(jsonData => {
                setPostFormError(jsonData.message);
                if (jsonData.status === "ok") {
                    setPostFormIsError(false);
                    setIsFetching(false);
                    navigate("/dashboard");
                } else {
                    setPostFormIsError(true);
                    setIsFetching(false);
                }
            })
            .catch(error => postFormError(error));
    }

    function handleAddQuestion() {
        const questions = [...form];
        questions.push(
            {
                question: null,
                description: null,
                type: "text",
                options: [""]
            }
        );
        setForm(questions);
    }

    function handleQuestionRemoval(index) {
        const questions = [...form];
        questions.splice(index, 1);
        setForm(questions);
    }

    function handleQuestionChange(index, event) {
        const questions = [...form];
        questions[index].question = event.target.value;
        setForm(questions);
    }

    function handleDescriptionChange(index, event) {
        const questions = [...form];
        questions[index].description = event.target.value;
        setForm(questions);
    }

    function handleTypeChange(index, event) {
        const questions = [...form];
        questions[index].options = [""];
        questions[index].type = event.target.value;
        setForm(questions);
    }

    function handleOptionChange(index, optionIndex, event) {
        const questions = [...form];
        questions[index].options[optionIndex] = event.target.value;
        setForm(questions);
    }

    function handleAddOption(index) {
        const questions = [...form];
        questions[index].options.push("");
        setForm(questions);
    }
    return (
        <div>
            <div className="section1 d-flex align-items-center justify-content-center">
                <div className="newForm p-4">
                    <form onSubmit={handleSubmit}>
                        {!errorMessage &&
                            <div>
                                <h3 className="text-center white">Create a new form</h3>
                                <p className="inputLabel mb-0 mt-4 white2">FORM TITLE</p>
                                <input
                                    type="text"
                                    value={formTitle}
                                    className="textInput mb-4 white"
                                    onChange={event => setFormTitle(event.target.value)}
                                    required
                                />
                                <p className="inputLabel mb-0 white2">FORM DESCRIPTION</p>
                                <textarea
                                    type="text"
                                    value={formDescription}
                                    className="textInput white"
                                    rows="3"
                                    onChange={event => setFormDescription(event.target.value)}
                                    required
                                />
                                {form.map((question, index) => (
                                    <div key={`${question}-${index}`}>
                                        <hr className="newRule" />
                                        <div>
                                            <h4 className="white newQuestion">Question {index + 1}</h4>
                                            <span onClick={index => handleQuestionRemoval(index)} class="material-icons-outlined white float-end deleteQuestion">
                                                close
                                            </span>
                                        </div>
                                        <p className="inputLabel mb-0 mt-3 white2">YOUR QUESTION</p>
                                        <input
                                            type="text"
                                            value={question.question || ""}
                                            className="textInput mb-3 white"
                                            onChange={event => handleQuestionChange(index, event)}
                                            required
                                        />
                                        <div className="row">
                                            <div className="col-sm-6 col-12">
                                                <p className="inputLabel mb-0 white2">DESCRIPTION</p>
                                                <textarea
                                                    type="text"
                                                    value={question.description || ""}
                                                    className="textInput mb-3 white"
                                                    rows="1"
                                                    onChange={event => handleDescriptionChange(index, event)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-sm-6 col-12">
                                                <label className="inputLabel mb-0 pb-0 white2">TYPE</label> <br />
                                                <select className="newSelect white" value={question.type} onChange={event => handleTypeChange(index, event)}>
                                                    <option className="newSelect" value="text">Text answer</option>
                                                    <option className="newSelect" value="mcq">Multiple choice answer</option>
                                                    <option className="newSelect" value="scq">Single choice answer</option>
                                                </select>
                                            </div>
                                        </div>
                                        {question.type !== "text" &&
                                            <div className="row align-items-center">
                                                {question.options.map((singleOption, optionIndex) => (
                                                    <div className="col-sm-6 col-12 mt-sm-0 mt-4">
                                                        <p className="inputLabel mb-0 white2">OPTION {optionIndex + 1}</p>
                                                        <input
                                                            type="text"
                                                            value={singleOption}
                                                            className="textInput mb-3 white"
                                                            required
                                                            onChange={event => handleOptionChange(index, optionIndex, event)}
                                                        />
                                                    </div>
                                                ))}
                                                <div className="col-sm-6 col-12">
                                                    <button type="button" className="secondaryButton addQuestionButton truncateToOneLine" onClick={() => { handleAddOption(index) }} disabled={isFetching}>Add a new option</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))}
                                <hr className="newRule m-0" />
                                <div className="row mt-3">
                                    <div className="col-md-6 col-12">
                                        <button type="button" className="secondaryButton addQuestionButton truncateToOneLine" onClick={() => { handleAddQuestion() }} disabled={isFetching}>
                                            Add a new question
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-12 mt-md-0 mt-3">
                                        <button className="createButton primaryButton truncateToOneLine" type="submit" disabled={isFetching}>
                                            {isFetching ? <p style={{ margin: "0" }}>Creating your form...</p> : <p style={{ margin: "0" }}>Create form</p>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}