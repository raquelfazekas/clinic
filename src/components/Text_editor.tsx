'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function TextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
}
