import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/useAuth";

export const useAssignedReports = () => {
  const { profile } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch Reports
    const fetchReports = async () => {
      //   console.log("Effect running");
      //   console.log("Profile:", user);

      if (!profile?.id) {
        // console.log("No profile ID yet");
        setLoading(false);
        return;
      }

        console.log("Fetching reports for:", profile.full_name);

      try {
        const { data: reports, error } = await supabase
          // const { data, error } = await supabase
          .from("report_assignments")
          .select(
            `
                assigned_at,
                assigned_by:profiles!report_assignments_assigned_by_fkey(full_name),
                reports (
                    *
                )
                `,
          )
        //   reports (
        //     id,
        //     incident_type,
        //     incident_location,
        //     report_status,
        //     report_priority,
        //     created_at,
        //     attachments
        // )
          .eq("assigned_to", profile.id)
          .order("assigned_at", { ascending: false });

        if (error) throw error;

        // Fetch attachments from storage bucket
        const reportsWithSignedUrls = await Promise.all(
          (reports || []).map(async (assignment) => {
            const attachments = await Promise.all(
              (assignment.reports?.attachments || []).map(async (file) => {
                const { data: signed } = await supabase.storage
                  .from("report-attachments")
                  .createSignedUrl(file.path, 60 * 60);

                return {
                  ...file,
                  signedUrl: signed?.signedUrl || null,
                };
              }),
            );

            // return { ...report, attachments };
            return {
              ...assignment.reports,
              attachments,
              assigned_at: assignment.assigned_at,
              assigned_by: assignment.assigned_by?.full_name,
            };
          }),
        );

        // console.log(profile);

        if (!controller.signal.aborted) {
          //   console.log(JSON.stringify(reports[0], null, 2));
            setData(reportsWithSignedUrls);

        }

        // console.log(reports);
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
  }, [profile?.id]);

  return { data, loading, profile };
};
