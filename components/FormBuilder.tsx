"use client";

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";
import { IQuestion } from "@/models/Form";

interface SortableQuestionProps {
  question: IQuestion;
  index: number;
  onUpdate: (index: number, question: IQuestion) => void;
  onDelete: (index: number) => void;
}

function SortableQuestion({
  question,
  index,
  onUpdate,
  onDelete,
}: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow p-6 mb-4"
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1 space-y-4">
          <div>
            <input
              type="text"
              value={question.label}
              onChange={(e) =>
                onUpdate(index, { ...question, label: e.target.value })
              }
              className="w-full text-lg border-b-2 border-gray-300 focus:border-blue-500 outline-none pb-2"
              placeholder="Question"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={question.type}
              onChange={(e) =>
                onUpdate(index, {
                  ...question,
                  type: e.target.value as IQuestion["type"],
                })
              }
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Short Text</option>
              <option value="textarea">Long Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="select">Dropdown</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.required || false}
                onChange={(e) =>
                  onUpdate(index, { ...question, required: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span>Required</span>
            </label>
          </div>

          {(question.type === "radio" ||
            question.type === "checkbox" ||
            question.type === "select") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Options (one per line):
              </label>
              <textarea
                value={(question.options || []).join("\n")}
                onChange={(e) =>
                  onUpdate(index, {
                    ...question,
                    options: e.target.value.split("\n").filter((o) => o.trim()),
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
              />
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(index)}
          className="text-gray-400 hover:text-red-600 mt-2"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

interface FormBuilderProps {
  initialTitle?: string;
  initialQuestions?: IQuestion[];
  formId?: string;
}

export default function FormBuilder({
  initialTitle = "Untitled Form",
  initialQuestions = [],
  formId,
}: FormBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState<IQuestion[]>(initialQuestions);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const addQuestion = () => {
    const newQuestion: IQuestion = {
      id: `q-${Date.now()}`,
      type: "text",
      label: "",
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, question: IQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveForm = async () => {
    setSaving(true);
    setSaveMessage("");

    try {
      const url = formId ? `/api/forms/${formId}` : "/api/forms";
      const method = formId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions, published: true }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage(`Form saved! View at: /view/${data.data._id}`);
        // If it's a new form, update the URL without navigation
        if (!formId && data.data._id) {
          window.history.pushState({}, "", `/builder?id=${data.data._id}`);
        }
      } else {
        setSaveMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setSaveMessage(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-heading font-bold w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none pb-2"
          placeholder="Form Title"
        />
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question, index) => (
            <SortableQuestion
              key={question.id}
              question={question}
              index={index}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={addQuestion}
        className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Question
      </button>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={saveForm}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {saving ? "Saving..." : "Save Form"}
        </button>

        {saveMessage && (
          <p
            className={`${
              saveMessage.startsWith("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
