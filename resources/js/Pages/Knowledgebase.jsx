import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import '/resources/css/knowledgebase.css';


export default function KnowledgeBase({ articleTitle, lastModifiedDate, blogReportedData, blogPosts }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    KnowledgeBase
                </h2>
            }
        >
            <Head title="Knowledge Base" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-2xl font-bold">{articleTitle || 'No title found.'}</h3>
                            <p><strong>Last Modified Date:</strong> {lastModifiedDate || 'N/A'}</p>
                            <p><strong>Reported Data:</strong> {blogReportedData || 'N/A'}</p>

                            <div className="mt-4">
                                <strong>Blog Post Content:</strong>
                                {blogPosts.length > 0 ? (
                                    blogPosts.map((post, index) => (
                                        <div
                                            key={index}
                                            className="mt-4"
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post) }}
                                        />
                                    ))
                                ) : (
                                    <p>No content available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
