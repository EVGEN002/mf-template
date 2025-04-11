const CodeViewer = ({ code }: { code: any }) => {
  return (
    <div className="mx-auto max-w-4xl rounded bg-black p-4 text-lime-400 dark:bg-zinc-800">
      <pre>{JSON.stringify(code)}</pre>
    </div>
  );
};

export default CodeViewer;
