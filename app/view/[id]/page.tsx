"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IQuestion } from "@/models/Form";

export default function ViewFormPage() {
  const params = useParams();
  const formId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    questions: IQuestion[];
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          title: data.data.title,
          questions: data.data.questions,
        });
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    // Validate required fields
    const missingRequired = formData?.questions.filter(
      (q) => q.required && !answers[q.id]
    );

    if (missingRequired && missingRequired.length > 0) {
      setSubmitMessage("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, answers }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Response submitted successfully!");
        setAnswers({});
      } else {
        setSubmitMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: IQuestion) => {
    switch (question.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={question.type}
            value={answers[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "textarea":
        return (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required={question.required}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(answers[question.id] || []).includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(question.id, option, e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "select":
        return (
          <select
            value={answers[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {formData.title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              <label className="block mb-4">
                <span className="text-lg font-medium">
                  {question.label}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </span>
              </label>
              {renderQuestion(question)}
            </div>
          ))}

          <div className="bg-white rounded-lg shadow p-6">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>

            {submitMessage && (
              <p
                className={`mt-4 ${
                  submitMessage.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
