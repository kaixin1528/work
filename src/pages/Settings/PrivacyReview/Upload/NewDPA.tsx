import { faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import FileInput from "src/components/Input/FileInput";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { UploadDPA } from "src/services/settings/privacy-review/upload";

const NewDPA = () => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    title: "",
    file: "",
  });

  const uploadDPA = UploadDPA();

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 w-max text-sm dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            title: "",
            file: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        <h4 className="w-max">New DPA</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 py-4 h-full overflow-auto scrollbar">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload New DPA
          </h3>
          <RegularInput
            label="Title"
            keyName="title"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <FileInput
            label="DPA"
            keyName="file"
            types={["pdf", "docx"]}
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={inputs.title === "" || inputs.file === ""}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("title", inputs.title);
              if (inputs.file) formData.append("file", inputs.file);
              uploadDPA.mutate({
                formData: formData,
              });
              handleOnClose();
            }}
          >
            Done
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewDPA;
