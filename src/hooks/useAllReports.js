import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useAllReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch Reports
    const fetchReports = async () => {
      setLoading(true);

      try {

        const { data: reports, error } = await supabase
          .from("reports")
          .select(
            `
            *,
            report_assignments (
              assigned_to:profiles!report_assignments_assigned_to_fkey(full_name),
              assigned_by:profiles!report_assignments_assigned_by_fkey(full_name)
            )
          `,
          )
        //   .gte("created_at", startOfToday)
        //   .lt("created_at", startOfTomorrow)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch attachments from storage bucket
        const reportsWithSignedUrls = await Promise.all(
          (reports || []).map(async (report) => {
            const attachments = await Promise.all(
              (report.attachments || []).map(async (file) => {
                const { data: signed } = await supabase.storage
                  .from("report-attachments")
                  .createSignedUrl(file.path, 60 * 60);

                return {
                  ...file,
                  signedUrl: signed?.signedUrl || null,
                };
              }),
            );

            return { ...report, attachments };
          }),
        );

        if (!controller.signal.aborted) {
          setData(reportsWithSignedUrls);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setData([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => controller.abort();
  }, []);

  return { data, loading };
};
