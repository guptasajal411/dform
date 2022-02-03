import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import domain from "../common/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/Form.css";
import "./css/Fonts.css";

export default function Form() {
    const params = useParams();
    const [errorMessage, setErrorMessage] = useState();
    const [formTitle, setFormTitle] = useState();
    const [formDescription, setFormDescription] = useState("");
    const [formViews, setFormViews] = useState();
    const [formQuestions, setFormQuestions] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);
    const [submitMessage, setSubmitMessage] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function dashboard() {
            await fetch(domain + "/api/form/" + params.formSlug, {
                method: "GET"
            })
                .then(response => response.json())
                .then((jsonData) => {
                    if (jsonData.status === "ok") {
                        setIsLoading(false);
                        setFormTitle(jsonData.form.formTitle);
                        setFormDescription(jsonData.form.formDescription);
                        jsonData.form.formQuestions.map((question) => {
                            if (question.type === "text") {
                                question.answer = [""];
                            } else {
                                question.answer = [];
                                question.options.map((option, optionIndex) => {
                                    question.answer[optionIndex] = false;
                                });
                            }
                        });
                        setFormQuestions(jsonData.form.formQuestions);
                        setFormViews(jsonData.form.formViews);
                    } else {
                        setIsLoading(false);
                        setErrorMessage(jsonData.message);
                    }
                });
        }
        dashboard();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch(domain + "/api/form/" + params.formSlug, {
            headers: { 'Content-Type': 'application/json ' },
            body: JSON.stringify(formQuestions),
            method: "POST"
        })
            .then(response => response.json())
            .then(response => {
                setIsFetching(false);
                setSubmitMessage(response.message);
                if (response.status === "ok") {
                    setError(false);
                } else {
                    setError(true);
                }
            });
    }

    function handleTextAnswerChange(index, event) {
        const questions = [...formQuestions];
        questions[index].answer[0] = event.target.value;
        setFormQuestions(questions);
    }

    function handleMcqAnswerChange(index, optionIndex, event) {
        const questions = [...formQuestions];
        questions[index].answer[optionIndex] = event.target.checked;
        setFormQuestions(questions);
    }

    function handleScqAnswerChange(index, optionIndex, event) {
        const questions = [...formQuestions];
        questions[index].options.map((option, optionIndex) => {
            questions[index].answer[optionIndex] = false;
        });
        questions[index].answer[optionIndex] = event.target.checked;
        setFormQuestions(questions);
    }

    return (
        <div>
            <div className="section1 d-flex align-items-center justify-content-center">
                <div className="form p-4 shadow-lg">
                    {isLoading &&
                        <div>
                            <h3 className="text-center white mt-2">Loading your form...</h3>
                        </div>
                    }             {errorMessage && <h5 className="text-center" style={{ color: "#ed4245" }}>{errorMessage}</h5>}
                    {formTitle && formDescription && formViews &&
                        <form onSubmit={event => handleSubmit(event)}>
                            <h3 className="text-start white mt-2">{formTitle}</h3>
                            <p className="text-start white2 mt-3">{formDescription}</p>
                            <hr className="formRule" />
                            {formQuestions.map((question, index) => (
                                <div key={`${question}-${index}`} className="formQuestion my-4">
                                    <h5 className="question mb-1 white">{question.question}</h5>
                                    <p className="description inputLabel white2 m-0">{question.description}</p>
                                    {question.type === "text" &&
                                        <input
                                            type="text"
                                            value={question.answer[0]}
                                            onChange={(event) => { handleTextAnswerChange(index, event) }}
                                            className="formInput"
                                            spellCheck="false"
                                            required
                                        />
                                    }
                                    {question.type === "mcq" &&
                                        <div className="mt-1">
                                            {question.options.map((singleOption, optionIndex) => (
                                                <div className="white2 mt-1 mcq">
                                                    <input
                                                        type="checkbox"
                                                        value={singleOption}
                                                        onChange={(event) => { handleMcqAnswerChange(index, optionIndex, event) }}
                                                        id={index + "." + optionIndex}
                                                    />
                                                    <label for={index + "." + optionIndex}>{singleOption}</label>
                                                </div>
                                            ))
                                            }
                                        </div>
                                    }
                                    {question.type === "scq" &&
                                        <div>
                                            {question.options.map((singleOption, optionIndex) => (
                                                <div className="white2 mcq pt-2 d-flex align-items-center">
                                                    <input
                                                        type="radio"
                                                        value={singleOption}
                                                        id={index + "." + optionIndex}
                                                        onChange={(event) => { handleScqAnswerChange(index, optionIndex, event) }}
                                                        name={index}
                                                    />
                                                    <label for={index + "." + optionIndex}>{singleOption}</label>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            ))}
                            <button type="submit" disabled={isFetching} className="submitButton white py-2">
                                {isFetching ? "Submitting..." : "Submit"}
                            </button>
                            <p style={{ color: error ? '#ed4245' : "#61ff61" }} className="mt-3">
                                {submitMessage}
                                {errorMessage && <p style={{ color: "#ed4245" }}>{errorMessage}</p>}
                            </p>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
}