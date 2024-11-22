import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ message: '', type: '' }); // To handle popup messages

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/view_document');
        if (!response.ok) {
          throw new Error(`Failed to fetch document. Status: ${response.status}`);
        }

        let content = await response.text();
        if (content.startsWith('"') && content.endsWith('"')) {
          content = content.slice(1, -1);
        }

        // Replace tab characters with a single space
        content = content.replace(/\\t|[\t]/g, ' ');

        content = content.replace('￼', ' ');

        setHtmlContent(content);
      } catch (error) {
        console.error('Error fetching document:', error.message);
        setHtmlContent('<p>Error loading document content.</p>');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, []);

  const handleEditorChange = (content) => {
    setHtmlContent(content);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let cleanedHtmlContent = htmlContent.replace(/%22/g, '');
      cleanedHtmlContent = cleanedHtmlContent
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/\\t|[\t]/g, ' ');
  
      cleanedHtmlContent = await preprocessImages(cleanedHtmlContent);
      cleanedHtmlContent = cleanedHtmlContent.replace(
        /<img/g,
        '<img style="margin: 10px 0; display: block;"'
      );
  
      // Create a Blob for the cleaned HTML content
      const htmlBlob = new Blob([cleanedHtmlContent], { type: 'text/html' });
  
      // Prepare formData and append the HTML Blob
      const formData = new FormData();
      formData.append('uploaded_file', htmlBlob, 'document.html');
  
      // Send the HTML file to the API
      const response = await fetch('http://127.0.0.1:8000/updated_content', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save document. Status: ${response.status}`);
      }
  
      setPopup({ message: 'Document content saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error saving document:', error.message);
      setPopup({ message: 'Failed to save document content.', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setPopup({ message: '', type: '' }), 3000); // Close popup after 3 seconds
    }
  };
  
  

  const preprocessImages = async (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');

    for (let img of images) {
      const image = new Image();
      image.src = img.src;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const maxWidth = 500;
      if (image.width > maxWidth) {
        const scaleFactor = maxWidth / image.width;
        img.width = maxWidth;
        img.height = image.height * scaleFactor;
      }
    }

    return doc.body.innerHTML;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-800 p-6 relative">
      <Header />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {popup.message && (
        <div
          className={`absolute bottom-5 right-10 p-4 rounded-lg text-white shadow-lg ${
            popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {popup.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-10">Advanced Text Editor</h1>

      <TinyMCEEditor
        apiKey="0k97qca1mr7tgnat5q69j145hfbz7stmzgcvgeuv2z3w12po"
        value={htmlContent}
        onEditorChange={handleEditorChange}
        init={{
          height: '80vh', // Dynamically fit height
          width: '90%', // Dynamically fit width
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' + '|image|'+
            'removeformat | help',
            image_title: false, // Remove the title field
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: (callback, value, meta) => {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
        
                input.onchange = function () {
                  const file = this.files[0];
                  const reader = new FileReader();
                  reader.onload = function () {
                    callback(reader.result, { alt: file.name });
                  };
                  reader.readAsDataURL(file);
                };
        
                input.click();
              }
            },
          
        }}
        className="w-full max-w-2xl"
      />

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 text-blue-800 bg-white font-semibold rounded-lg shadow-md focus:outline-none"
      >
        Save File
      </button>
    </div>
  );
}

export default Editor;
