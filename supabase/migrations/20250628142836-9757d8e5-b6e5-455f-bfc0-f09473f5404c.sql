
-- Primeiro, vamos verificar e criar apenas as políticas que não existem
-- Usar DROP POLICY IF EXISTS para evitar conflitos

-- Remover políticas existentes para recriar com nomes consistentes
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.avaliacoes;
DROP POLICY IF EXISTS "Users can create reviews for their events" ON public.avaliacoes;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.avaliacoes;

DROP POLICY IF EXISTS "Professionals can view their own applications" ON public.candidaturas;
DROP POLICY IF EXISTS "Event owners can view applications to their events" ON public.candidaturas;
DROP POLICY IF EXISTS "Professionals can create applications" ON public.candidaturas;
DROP POLICY IF EXISTS "Professionals can update their own applications" ON public.candidaturas;
DROP POLICY IF EXISTS "Event owners can update applications to their events" ON public.candidaturas;

DROP POLICY IF EXISTS "Anyone can view events" ON public.eventos;
DROP POLICY IF EXISTS "Users can create events" ON public.eventos;
DROP POLICY IF EXISTS "Users can update their own events" ON public.eventos;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.eventos;

DROP POLICY IF EXISTS "Anyone can view professional profiles" ON public.profissionais;
DROP POLICY IF EXISTS "Users can create their own professional profile" ON public.profissionais;
DROP POLICY IF EXISTS "Users can update their own professional profile" ON public.profissionais;
DROP POLICY IF EXISTS "Users can delete their own professional profile" ON public.profissionais;

DROP POLICY IF EXISTS "Anyone can view portfolio items" ON public.portfolio;
DROP POLICY IF EXISTS "Users can manage their own portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Users can delete their own portfolio" ON public.portfolio;

-- Recriar todas as políticas de forma consistente
-- Políticas para avaliacoes (Reviews)
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

-- Políticas para candidaturas (Applications)
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

-- Políticas para eventos (Events)
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

-- Políticas para profissionais (Professionals)
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

-- Políticas para portfolio
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

-- Adicionar índices para melhorar performance (usar IF NOT EXISTS para evitar erros)
CREATE INDEX IF NOT EXISTS idx_profissionais_user_id ON public.profissionais(user_id);
CREATE INDEX IF NOT EXISTS idx_eventos_contratante_id ON public.eventos(contratante_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_profissional_id ON public.candidaturas(profissional_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_evento_id ON public.candidaturas(evento_id);
CREATE INDEX IF NOT EXISTS idx_reservas_contratante_id ON public.reservas(contratante_id);
CREATE INDEX IF NOT EXISTS idx_reservas_profissional_id ON public.reservas(profissional_id);
CREATE INDEX IF NOT EXISTS idx_carrinhos_contratante_id ON public.carrinhos(contratante_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_profissional_id ON public.portfolio(profissional_id);

-- Adicionar foreign keys apenas se não existirem (usando DO $$ para controle condicional)
DO $$
BEGIN
  -- Verificar e adicionar foreign keys para avaliacoes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'avaliacoes' AND constraint_name = 'fk_avaliacoes_evento'
  ) THEN
    ALTER TABLE public.avaliacoes 
    ADD CONSTRAINT fk_avaliacoes_evento 
    FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'avaliacoes' AND constraint_name = 'fk_avaliacoes_profissional'
  ) THEN
    ALTER TABLE public.avaliacoes 
    ADD CONSTRAINT fk_avaliacoes_profissional 
    FOREIGN KEY (profissional_id) REFERENCES public.profissionais(id) ON DELETE CASCADE;
  END IF;

  -- Foreign keys para candidaturas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'candidaturas' AND constraint_name = 'fk_candidaturas_evento'
  ) THEN
    ALTER TABLE public.candidaturas 
    ADD CONSTRAINT fk_candidaturas_evento 
    FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'candidaturas' AND constraint_name = 'fk_candidaturas_profissional'
  ) THEN
    ALTER TABLE public.candidaturas 
    ADD CONSTRAINT fk_candidaturas_profissional 
    FOREIGN KEY (profissional_id) REFERENCES public.profissionais(id) ON DELETE CASCADE;
  END IF;

  -- Foreign keys para reservas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'reservas' AND constraint_name = 'fk_reservas_evento'
  ) THEN
    ALTER TABLE public.reservas 
    ADD CONSTRAINT fk_reservas_evento 
    FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'reservas' AND constraint_name = 'fk_reservas_profissional'
  ) THEN
    ALTER TABLE public.reservas 
    ADD CONSTRAINT fk_reservas_profissional 
    FOREIGN KEY (profissional_id) REFERENCES public.profissionais(id) ON DELETE CASCADE;
  END IF;

  -- Foreign keys para pagamentos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'pagamentos' AND constraint_name = 'fk_pagamentos_reserva'
  ) THEN
    ALTER TABLE public.pagamentos 
    ADD CONSTRAINT fk_pagamentos_reserva 
    FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE;
  END IF;

  -- Foreign keys para carrinho_itens
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'carrinho_itens' AND constraint_name = 'fk_carrinho_itens_carrinho'
  ) THEN
    ALTER TABLE public.carrinho_itens 
    ADD CONSTRAINT fk_carrinho_itens_carrinho 
    FOREIGN KEY (carrinho_id) REFERENCES public.carrinhos(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'carrinho_itens' AND constraint_name = 'fk_carrinho_itens_profissional'
  ) THEN
    ALTER TABLE public.carrinho_itens 
    ADD CONSTRAINT fk_carrinho_itens_profissional 
    FOREIGN KEY (profissional_id) REFERENCES public.profissionais(id) ON DELETE CASCADE;
  END IF;

  -- Foreign keys para portfolio
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'portfolio' AND constraint_name = 'fk_portfolio_profissional'
  ) THEN
    ALTER TABLE public.portfolio 
    ADD CONSTRAINT fk_portfolio_profissional 
    FOREIGN KEY (profissional_id) REFERENCES public.profissionais(id) ON DELETE CASCADE;
  END IF;
END $$;
