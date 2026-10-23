import { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

import GlassCard from "./GlassCard";
import GradientButton from "./GradientButton";
import AIProgress from "./AIProgress";

function UploadCard({

    title,
    description,
    buttonText,
    onUpload

}) {

    const inputRef = useRef();

    const [selectedFile, setSelectedFile] = useState(null);

    const [dragging, setDragging] = useState(false);

    const [uploading, setUploading] = useState(false);

    const [progress, setProgress] = useState(0);

    function chooseFile() {

        inputRef.current.click();

    }

    function onFileSelected(e) {

        if (e.target.files.length > 0)

            setSelectedFile(e.target.files[0]);

    }

    function onDrop(e) {

        e.preventDefault();

        setDragging(false);

        if (e.dataTransfer.files.length > 0)

            setSelectedFile(e.dataTransfer.files[0]);

    }

    async function upload() {

        if (!selectedFile) {

            alert("Select a PDF");

            return;

        }

        setUploading(true);

        setProgress(10);

        const timer = setInterval(() => {

            setProgress((old) => {

                if (old >= 90) return old;

                return old + 10;

            });

        }, 150);

        try {

            await onUpload(selectedFile);

            clearInterval(timer);

            setProgress(100);

            setTimeout(() => {

                setUploading(false);

            }, 500);

        }

        catch (err) {

            clearInterval(timer);

            setUploading(false);

            alert("Upload Failed");

        }

    }

    return (

        <GlassCard className="max-w-3xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-white">

                {title}

            </h1>

            <p className="text-slate-400 mt-3">

                {description}

            </p>

            <div

                onClick={chooseFile}

                onDragOver={(e) => {

                    e.preventDefault();

                    setDragging(true);

                }}

                onDragLeave={() => setDragging(false)}

                onDrop={onDrop}

                className={`

                mt-10

                rounded-3xl

                border-2

                border-dashed

                cursor-pointer

                transition-all

                duration-300

                p-12

                text-center

                ${dragging

                        ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"

                        : "border-slate-700 hover:border-blue-500 hover:bg-slate-800"

                    }

                `}

            >

                <UploadCloud

                    size={70}

                    className="mx-auto text-cyan-400"

                />

                <h2 className="text-white text-2xl mt-6">

                    Drag & Drop PDF

                </h2>

                <p className="text-slate-400 mt-3">

                    or click to browse

                </p>

                <p className="text-slate-500 mt-6">

                    Supports PDF Files

                </p>

                <input

                    ref={inputRef}

                    hidden

                    type="file"

                    accept=".pdf"

                    onChange={onFileSelected}

                />

            </div>

            {

                selectedFile &&

                <div className="mt-8 rounded-2xl bg-slate-800 p-5 flex justify-between items-center">

                    <div className="flex items-center gap-4">

                        <FileText

                            className="text-cyan-400"

                            size={35}

                        />

                        <div>

                            <h3 className="text-white">

                                {selectedFile.name}

                            </h3>

                            <p className="text-slate-400 text-sm">

                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB

                            </p>

                        </div>

                    </div>

                    <CheckCircle2

                        className="text-green-400"

                        size={30}

                    />

                </div>

            }

            {

                uploading &&

                <AIProgress progress={progress} />

            }

            <GradientButton

                className="mt-8"

                onClick={upload}

            >

                {

                    uploading

                        ?

                        "Uploading..."

                        :

                        buttonText

                }

            </GradientButton>

        </GlassCard>

    );

}

export default UploadCard;