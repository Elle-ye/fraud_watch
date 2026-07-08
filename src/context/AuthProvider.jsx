import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (currentUser) => {
    
    if (!currentUser) {
      setProfile(null);
      return;
    }

    // Fetch role from profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", currentUser.id)
      .single();

    // if (!error && data) {
    //   setRole(data.role);
    // } else {
    //   setRole(null);
    // }

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

//   Fetch current user session
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      await syncAuth(data.session);
    };

    const syncAuth = async (session) => {
      const currentUser = session?.user ?? null;
      if (!mounted) return;

      setUser(currentUser);
      await fetchUserProfile(currentUser);
      if (mounted) setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuth(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
