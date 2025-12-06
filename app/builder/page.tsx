"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormBuilder from "@/components/FormBuilder";
import { IQuestion } from "@/models/Form";

function BuilderContent() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");

  const [loading, setLoading] = useState(!!formId);
  const [formData, setFormData] = useState<{
    title: string;
    questions: IQuestion[];
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (formId) {
      loadForm();
    }
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
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto py-4 px-4">
          <h1 className="text-xl font-heading font-bold">Form Builder</h1>
        </div>
      </div>

      <FormBuilder
        initialTitle={formData?.title}
        initialQuestions={formData?.questions}
        formId={formId || undefined}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
