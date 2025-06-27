I would like you to port a Django project to Next.js in the following way:

- I have folder called @/buddhashanti-reporting which contains the Django project.
- Inside the apps folder, I have the following core modules:
    demographics
    economics
    infrastructure
    municipality_introduction
    reports
    social

The major part of the application is the reports module.
This Django application generates a publishing quality PDF report for a product called Digital Profile.
All the design and layout specifications are specified in the templates folder in the file pdf_full_report.html which 
is the end result of the report and the thing that I want to port to the Next.js application primarily.

How does the application currently work?
Currently I have modules for each major categories with sub categories inside them.
Each sub category has it's own processor file that does the following:
- Reads the data from the database (which is seeded by the management command)
- Does the detailed analysis of the data and creates a dynamic analysis based report content.
- Creates charts specific to the sub category (like bar charts, pie charts, line charts, pyramids, maps and such (in case of population pyramid))
There is limitation in the way that chart is created in the current Django application. Since Matplotlib cannot render complex ligatures like Devnagari, and as all the svg to png rendering engines didnot display the Devnagari characters proprerly, I have used inkscape to render the svg to png. This in turn takes time and lot of bandwidth to render the charts.

Now what I want to do is to port the application to Next.js and use the same data and same templates to generate the report.

The Next.js application should be able to generate the report in the same way as the Django application does.
Currently the Next.js application already has the necessary modules for all the components that the Django application uses.

How does the Next.js application work?
The application is divided into three parts.
- Dashboard
- Public Profile
- Trpc API Backend

The Dashboard is the main application that is used to generate the report.
The Public Profile is the public facing application that is used to view the digital profile of the municipality.
The Trpc API Backend is the backend that is used to generate the report as well as view the digital profile of the municipality and such.
The TRPC backend has the following format:
  getAll
  getByWard
  create
  update
  delete
  summary

Now currently the frontend digital profile takes these trpc calls and then uses them to dynamically analyse the data to recommend appropriate policies and identify trends and other patterns that might be present in the data.

I want you to do the following:
1. I want you to show me a preview of the report in the dashboard, that is something like a Next.js component accessed by admin.
2. I want you to apply print specific styles that I hae given aka like in the pdf.css to the report so that the final report is that of a publishing quality.