import React, { Component } from "react";

class Form extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email } = this.state;
        try {
            const response = await fetch("https://algeo02-22045.vercel.app/api/bio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email }), // Send data as JSON
            });
    
            if (response.ok) {
                console.log("Form submitted successfully");
            } else {
                console.error("Form submission failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };    

    render() {
        return (
            <div>
                <h2>Simple Form</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default Form;
