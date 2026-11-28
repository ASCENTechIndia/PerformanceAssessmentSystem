
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

const SpeechToTextTextarea = ({
    id,
    label,
    placeholder = "Enter description...",
    rows = 3,
    className = "pas-input resize-none",
    error,
    language = "en-IN",
    register,
    ...registerOptions
}) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);
    const hasSpeechRef = useRef(false);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        setIsSupported(true);

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
            let finalTranscript = "";
            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                const textarea = textareaRef.current;
                hasSpeechRef.current = true;

                if (textarea) {
                    const currentValue = textarea.value;
                    const separator = currentValue.trim() ? " " : "";

                    const updatedValue =
                        currentValue + separator + finalTranscript.trim();

                    // Trigger React Hook Form's registered onChange handler.
                    const nativeSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype,
                        "value"
                    ).set;

                    nativeSetter.call(textarea, updatedValue);

                    textarea.dispatchEvent(
                        new Event("input", { bubbles: true })
                    );
                }
            }
        };

        recognition.onstart = () => setIsListening(true);

        recognition.onend = () => {
            setIsListening(false);

            if (hasSpeechRef.current) {
                const textarea = textareaRef.current;

                if (textarea) {
                    const currentValue = textarea.value.trimEnd();

                    // Add a full stop only if the text doesn't already end
                    // with punctuation.
                    const updatedValue = /[.!?।]$/.test(currentValue)
                        ? currentValue
                        : `${currentValue}.`;

                    const nativeSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype,
                        "value"
                    ).set;

                    nativeSetter.call(textarea, updatedValue);

                    textarea.dispatchEvent(
                        new Event("input", { bubbles: true })
                    );
                }
            }

            hasSpeechRef.current = false;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
            recognitionRef.current = null;
        };
    }, [language]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error("Unable to start speech recognition:", error);
            }
        }
    };

    const registration = register
        ? register(id, registerOptions)
        : {};

    return (
        <div className="w-full space-y-1">
            {label && (
                <label htmlFor={id} className="pas-label">
                    {label}
                </label>
            )}

            <div className="relative">
                <textarea
                    id={id}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${className} pr-12`}
                    aria-invalid={!!error}
                    {...registration}
                    ref={(element) => {
                        textareaRef.current = element;
                        registration.ref?.(element);
                    }}
                />

                {isSupported && (
                    <button
                        type="button"
                        onClick={toggleListening}
                        title={
                            isListening
                                ? "Stop speech recognition"
                                : "Start speech recognition"
                        }
                        aria-label={
                            isListening
                                ? "Stop speech recognition"
                                : "Start speech recognition"
                        }
                        className={`absolute right-3 bottom-3 rounded-full p-2 transition-colors ${isListening
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {isListening ? (
                            <MicOff size={18} />
                        ) : (
                            <Mic size={18} />
                        )}
                    </button>
                )}
            </div>

            {isListening && (
                <p className="text-sm text-red-500">
                    Listening... Speak now.
                </p>
            )}

            {!isSupported && (
                <p className="text-xs text-gray-500">
                    Speech recognition is not supported in this browser.
                </p>
            )}

            {error && (
                <p className="pas-error text-sm">{error}</p>
            )}
        </div>
    );
};

export default SpeechToTextTextarea;
