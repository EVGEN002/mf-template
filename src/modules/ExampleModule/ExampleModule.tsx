import '@/assets/global.css';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { getTest } from './api';

import Todo from '@/types/Todo';
import CodeViewer from '@/components/CodeViewer';
import { Input } from '@/components/ui/input';

export default function ExampleModule() {
  const [data, setData] = useState<Todo[] | undefined | null | unknown>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const resposne = await getTest();

      if (resposne.success) {
        setData(resposne.data);
      }
    })();
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold italic">
            MF TEMPLATE
          </a>
          <div className="flex space-x-4">
            {['Webpack', 'shadcn/ui', 'Tailwind', 'React'].map((tech) => (
              <a
                key={tech}
                href={`https://${tech.toLowerCase().replace('/', '')}.com`}
                className="font-mono text-sm text-gray-600 transition-colors hover:text-rose-500 dark:text-gray-300"
              >
                {tech}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold italic">
            BUILD YOUR HOST/REMOTE{' '}
            <span className="text-blue-500">REACT 19</span> APP
          </h1>
          <p className="text-xl text-gray-600 italic dark:text-gray-300">
            Built with Webpack, shadcn/ui, Tailwind, and React
          </p>
        </div>

        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              title: 'Webpack',
              description: 'Module bundler for modern JavaScript applications'
            },
            {
              title: 'shadcn/ui',
              description: 'Beautiful and accessible UI components'
            },
            {
              title: 'Tailwind CSS',
              description:
                'Utility-first CSS framework for rapid UI development'
            },
            {
              title: 'React',
              description: 'A JavaScript library for building user interfaces'
            }
          ].map((tech) => (
            <Card
              key={tech.title}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <h2 className="mb-2 font-mono text-2xl font-semibold italic">
                  {tech.title}
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  {tech.description}
                </p>
                <Button asChild>
                  <a
                    href={`https://${tech.title.toLowerCase().replace('/', '')}.com`}
                  >
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <CodeViewer code={data} />
      </main>

      <footer className="mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} tailwind-webpack-shadcn-react 2.0.0
          </p>
        </div>
      </footer>
    </div>
  );
}
