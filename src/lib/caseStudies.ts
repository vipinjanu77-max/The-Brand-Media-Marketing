/**
 * Single publish rule for case studies: a case study is live when `draft` is false.
 * Turn off Draft in the CMS (or set `draft: false`) and it appears everywhere:
 * /case-studies/, the Results Library, service/industry pages and the linking engine.
 */
export const isPublishedCaseStudy = (c: { data: { draft: boolean } }): boolean => !c.data.draft;
