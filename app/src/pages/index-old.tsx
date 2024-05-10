declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

import { useState } from "react";
import type { FileUpload } from "@/types";

const allowedExtensions = new Set(['tsx'])

export default function Home() {
  const [fileUpload, setFileUpload] = useState<FileUpload[]>([])

  const getFileExtension = (filename: string) => filename.split('.').pop()

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const selectedFiles = files as FileList
    for (const file of selectedFiles) {
      let newFile = {} as FileUpload

      const path = file.webkitRelativePath
      if (path.includes('node_modules') || !allowedExtensions.has(getFileExtension(path) as string)) {
        continue
      }
      newFile['path'] = path
      newFile['name'] = file.name

      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        newFile['content'] = event.target?.result

        setFileUpload((_file: FileUpload[]) => [..._file, newFile])
      }
      reader.readAsText(file)
    }
  }

  // useEffect(() => {
  //   console.log('sample:', sample)
  //   const newFiles = sample.map(item => ({
  //     name: item.name,
  //     path: item.path,
  //     content: item.content,
  //   }));

  //   setFileUpload([...newFiles]);
  // }, [])

  return (
    <>
      <input type="file" id="filepicker" name="fileList" onChange={onFileChange} webkitdirectory='' multiple />
      <ul id="listing">
        {fileUpload.map((file) => {
          return (
            <li key={file.path}>
              <p>path: {file.path}</p>
              <p>name: {file.name}</p>
              <p>content:</p>
              <p>{file.content as string}</p>
              <p>-----------------</p>
            </li>
          )
        })}
      </ul>
    </>
  );
}
