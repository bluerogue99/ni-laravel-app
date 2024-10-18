<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Psr\Http\Message\RequestInterface;

class KnowledgeBaseController extends Controller
{
    public function index()
    {
        $url = 'https://knowledge.ni.com/KnowledgeArticleDetails?id=kA0VU0000003kmH0AQ';

        // Make the request with SSL verification disabled and custom headers
        $response = Http::withRequestMiddleware(function (RequestInterface $request) {
            return $request->withHeader('User-Agent', 'Laravel Scraper/1.0');
        })
        ->withOptions(['verify' => false])
        ->get($url);

        if ($response->successful()) {
            $html = $response->body(); // Raw HTML of the page
            $dom = new \DOMDocument();
            @$dom->loadHTML($html);

            $xpath = new \DOMXPath($dom);

            // Initialize an array for the scraped data
            $scrapedData = [
                'blogTitle' => '',
                'lastModifiedDate' => '',
                'blogReportedData' => '',
                'blogPosts' => [], // An array to hold multiple blog posts
            ];

            // Extract the data based on the class names
            $scrapedData['blogTitle'] = $this->getElementHTMLByClass($xpath, 'blog-title'); // Single element, HTML content
            $scrapedData['lastModifiedDate'] = $this->getElementContentByClass($xpath, 'lastModifiedDate'); // Single element, text content
            $scrapedData['blogReportedData'] = $this->getElementContentByClass($xpath, 'blog-reported-data'); // Single element, text content
            $scrapedData['blogPosts'] = $this->getElementsHTMLByClass($xpath, 'blog-post'); // Multiple elements, HTML content

            // Pass the scraped data to the view
            return Inertia::render('Knowledgebase', [
                'articleTitle' => $scrapedData['blogTitle'] ?: 'Title not found',
                'lastModifiedDate' => $scrapedData['lastModifiedDate'] ?: 'Date not found',
                'blogReportedData' => $scrapedData['blogReportedData'] ?: 'Reported data not found',
                'blogPosts' => $scrapedData['blogPosts'] ?: ['No content available'],
            ]);
        } else {
            return Inertia::render('Knowledgebase', [
                'articleTitle' => 'Error fetching article.',
                'lastModifiedDate' => '',
                'blogReportedData' => '',
                'blogPosts' => ['No content available'],
            ]);
        }
    }

    // Helper function to get element HTML by class name (for single elements)
    private function getElementHTMLByClass($xpath, $className)
{
    $elements = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $className ')]");
    $htmlArray = [];

    foreach ($elements as $element) {
        // Use strip_tags to remove HTML tags
        $htmlArray[] = trim(strip_tags($element->ownerDocument->saveHTML($element)));
    }

    return count($htmlArray) > 0 ? implode(' ', $htmlArray) : '';
}

    // Helper function to get multiple elements' content by class name
    private function getElementsHTMLByClass($xpath, $className)
    {
        $elements = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $className ')]");
        $htmlArray = [];

        foreach ($elements as $element) {
            $htmlArray[] = trim($element->ownerDocument->saveHTML($element));
        }

        return $htmlArray;
    }

    // Helper function to get element content by class name (for single elements)
    private function getElementContentByClass($xpath, $className)
    {
        $elements = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $className ')]");
        $contentArray = [];

        foreach ($elements as $element) {
            $contentArray[] = trim($element->textContent);
        }

        return count($contentArray) > 0 ? implode(' ', $contentArray) : '';
    }
}
