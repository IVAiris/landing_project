"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    description: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", description: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          description: formData.description
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();
          const fieldErrors = data.errors ?? {};
          setErrors({
            name: fieldErrors.name?.[0] ?? "",
            email: fieldErrors.email?.[0] ?? "",
            description: fieldErrors.description?.[0] ?? ""
          });
        } else {
          setSubmitError("Не удалось отправить заявку. Попробуйте снова позже.");
        }
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("Не удалось отправить заявку. Проверьте соединение и попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="#hero">Hero</a>
        <a href="#pros">Pros</a>
        <a href="#questions">Questions</a>
        <a href="#form">Form</a>
      </nav>

      <section id="hero" className={styles.hero}>
        <h1>Welcome to Our Landing Page</h1>
        <p>Discover the benefits of our product.</p>
      </section>

      <section id="pros" className={styles.pros}>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </section>

      <section id="questions" className={styles.questions}>
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li>Question 1</li>
          <li>Question 2</li>
          <li>Question 3</li>
        </ul>
      </section>

      <section id="form" className={styles.formSection}>
        <h2>Contact Us</h2>
        {isSubmitted ? (
          <div className={styles.success}>Thank you for your submission!</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Task Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className={styles.error}>{errors.description}</span>}
            </div>
            {submitError && <span className={styles.error}>{submitError}</span>}
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
