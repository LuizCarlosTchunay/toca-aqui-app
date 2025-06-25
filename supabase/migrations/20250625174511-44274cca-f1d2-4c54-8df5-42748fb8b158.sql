
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrinhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrinho_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop and recreate all policies to ensure consistency
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Professional profiles policies
DROP POLICY IF EXISTS "Anyone can view professional profiles" ON public.profissionais;
DROP POLICY IF EXISTS "Users can create their own professional profile" ON public.profissionais;
DROP POLICY IF EXISTS "Users can update their own professional profile" ON public.profissionais;
DROP POLICY IF EXISTS "Users can delete their own professional profile" ON public.profissionais;

-- Portfolio policies
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON public.portfolio;
DROP POLICY IF EXISTS "Users can manage their own portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Users can delete their own portfolio" ON public.portfolio;

-- Events policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.eventos;
DROP POLICY IF EXISTS "Users can create events" ON public.eventos;
DROP POLICY IF EXISTS "Users can update their own events" ON public.eventos;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.eventos;

-- Applications policies
DROP POLICY IF EXISTS "Professionals can view their own applications" ON public.candidaturas;
DROP POLICY IF EXISTS "Event owners can view applications to their events" ON public.candidaturas;
DROP POLICY IF EXISTS "Professionals can create applications" ON public.candidaturas;
DROP POLICY IF EXISTS "Professionals can update their own applications" ON public.candidaturas;
DROP POLICY IF EXISTS "Event owners can update applications to their events" ON public.candidaturas;

-- Now create all the policies
-- Notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Users
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (id = auth.uid());

-- User settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Professional profiles
CREATE POLICY "Anyone can view professional profiles" 
  ON public.profissionais 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create their own professional profile" 
  ON public.profissionais 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own professional profile" 
  ON public.profissionais 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own professional profile" 
  ON public.profissionais 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Portfolio
CREATE POLICY "Anyone can view portfolio items" 
  ON public.portfolio 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can manage their own portfolio" 
  ON public.portfolio 
  FOR INSERT 
  WITH CHECK (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own portfolio" 
  ON public.portfolio 
  FOR UPDATE 
  USING (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own portfolio" 
  ON public.portfolio 
  FOR DELETE 
  USING (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

-- Events
CREATE POLICY "Anyone can view events" 
  ON public.eventos 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create events" 
  ON public.eventos 
  FOR INSERT 
  WITH CHECK (contratante_id = auth.uid());

CREATE POLICY "Users can update their own events" 
  ON public.eventos 
  FOR UPDATE 
  USING (contratante_id = auth.uid());

CREATE POLICY "Users can delete their own events" 
  ON public.eventos 
  FOR DELETE 
  USING (contratante_id = auth.uid());

-- Applications
CREATE POLICY "Professionals can view their own applications" 
  ON public.candidaturas 
  FOR SELECT 
  USING (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can view applications to their events" 
  ON public.candidaturas 
  FOR SELECT 
  USING (
    evento_id IN (
      SELECT id FROM public.eventos WHERE contratante_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can create applications" 
  ON public.candidaturas 
  FOR INSERT 
  WITH CHECK (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can update their own applications" 
  ON public.candidaturas 
  FOR UPDATE 
  USING (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can update applications to their events" 
  ON public.candidaturas 
  FOR UPDATE 
  USING (
    evento_id IN (
      SELECT id FROM public.eventos WHERE contratante_id = auth.uid()
    )
  );

-- Reservations
CREATE POLICY "Users can view their own reservations as contractors" 
  ON public.reservas 
  FOR SELECT 
  USING (contratante_id = auth.uid());

CREATE POLICY "Professionals can view their own reservations" 
  ON public.reservas 
  FOR SELECT 
  USING (
    profissional_id IN (
      SELECT id FROM public.profissionais WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reservations" 
  ON public.reservas 
  FOR INSERT 
  WITH CHECK (contratante_id = auth.uid());

CREATE POLICY "Users can update their own reservations" 
  ON public.reservas 
  FOR UPDATE 
  USING (contratante_id = auth.uid());

-- Reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.avaliacoes 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create reviews for their events" 
  ON public.avaliacoes 
  FOR INSERT 
  WITH CHECK (contratante_id = auth.uid());

CREATE POLICY "Users can update their own reviews" 
  ON public.avaliacoes 
  FOR UPDATE 
  USING (contratante_id = auth.uid());

-- Payments
CREATE POLICY "Users can view their own payments" 
  ON public.pagamentos 
  FOR SELECT 
  USING (
    reserva_id IN (
      SELECT id FROM public.reservas WHERE contratante_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments for their reservations" 
  ON public.pagamentos 
  FOR INSERT 
  WITH CHECK (
    reserva_id IN (
      SELECT id FROM public.reservas WHERE contratante_id = auth.uid()
    )
  );

-- Shopping cart
CREATE POLICY "Users can view their own cart" 
  ON public.carrinhos 
  FOR SELECT 
  USING (contratante_id = auth.uid());

CREATE POLICY "Users can create their own cart" 
  ON public.carrinhos 
  FOR INSERT 
  WITH CHECK (contratante_id = auth.uid());

CREATE POLICY "Users can update their own cart" 
  ON public.carrinhos 
  FOR UPDATE 
  USING (contratante_id = auth.uid());

CREATE POLICY "Users can delete their own cart" 
  ON public.carrinhos 
  FOR DELETE 
  USING (contratante_id = auth.uid());

-- Cart items
CREATE POLICY "Users can view their own cart items" 
  ON public.carrinho_itens 
  FOR SELECT 
  USING (
    carrinho_id IN (
      SELECT id FROM public.carrinhos WHERE contratante_id = auth.uid()
    )
  );

CREATE POLICY "Users can add items to their own cart" 
  ON public.carrinho_itens 
  FOR INSERT 
  WITH CHECK (
    carrinho_id IN (
      SELECT id FROM public.carrinhos WHERE contratante_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cart items" 
  ON public.carrinho_itens 
  FOR UPDATE 
  USING (
    carrinho_id IN (
      SELECT id FROM public.carrinhos WHERE contratante_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cart items" 
  ON public.carrinho_itens 
  FOR DELETE 
  USING (
    carrinho_id IN (
      SELECT id FROM public.carrinhos WHERE contratante_id = auth.uid()
    )
  );
